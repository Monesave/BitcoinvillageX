// @ts-nocheck
import { Request, Response, NextFunction } from 'express';
import { supabase } from '../services/supabase';
import { createEscrow, releaseEscrow, refundEscrow } from '../services/escrow.service';
import { AppError } from '../../shared/src/utils';;

// ============================================================================
// SERVICE LISTINGS
// ============================================================================

// Get all service listings
export const getListings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      location,
      country,
      search,
      isActive = true,
      page = 1,
      limit = 20,
    } = req.query;

    let query = supabase
      .from('service_listings')
      .select(`
        *,
        provider:profiles!service_listings_provider_id_fkey (
          id,
          username,
          display_name,
          avatar_url,
          reputation_score,
          is_verified_villager
        )
      `)
      .eq('is_active', isActive === 'true' || isActive === true)
      .order('created_at', { ascending: false });

    // Apply filters
    if (category) {
      query = query.eq('category', category as string);
    }

    if (minPrice) {
      query = query.gte('base_price_sats', parseInt(minPrice as string));
    }

    if (maxPrice) {
      query = query.lte('base_price_sats', parseInt(maxPrice as string));
    }

    if (location) {
      query = query.ilike('location', `%${location}%`);
    }

    if (country) {
      query = query.ilike('country', `%${country}%`);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    // Pagination
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const from = (pageNum - 1) * limitNum;
    const to = from + limitNum - 1;

    query = query.range(from, to);

    const { data: listings, error } = await query;

    if (error) {
      throw new AppError('Failed to fetch listings', 500, 'DATABASE_ERROR');
    }

    res.json({
      success: true,
      data: {
        listings: listings || [],
        pagination: {
          page: pageNum,
          limit: limitNum,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get single service listing
export const getListing = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const { data: listing, error } = await supabase
      .from('service_listings')
      .select(`
        *,
        provider:profiles!service_listings_provider_id_fkey (
          id,
          username,
          display_name,
          avatar_url,
          reputation_score,
          is_verified_villager,
          total_transactions
        )
      `)
      .eq('id', id)
      .single();

    if (error || !listing) {
      throw new AppError('Listing not found', 404, 'LISTING_NOT_FOUND');
    }

    // Increment view count (non-blocking)
    supabase
      .from('service_listings')
      .update({ views: (listing.views || 0) + 1 })
      .eq('id', id)
      .then(() => {});

    res.json({
      success: true,
      data: { listing },
    });
  } catch (error) {
    next(error);
  }
};

// Create service listing
export const createListing = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError('User not authenticated', 401, 'UNAUTHORIZED');
    }

    const {
      title,
      description,
      category,
      basePriceSats,
      priceType,
      deliveryTimeDays,
      revisionLimit = 2,
      images = [],
      location,
      country,
    } = req.body;

    if (!title || !basePriceSats) {
      throw new AppError('Title and base price are required', 400, 'VALIDATION_ERROR');
    }

    const basePriceSatsNum = typeof basePriceSats === 'string' ? parseInt(basePriceSats) : basePriceSats;
    const deliveryTimeDaysNum = deliveryTimeDays ? (typeof deliveryTimeDays === 'string' ? parseInt(deliveryTimeDays) : deliveryTimeDays) : null;
    const revisionLimitNum = typeof revisionLimit === 'string' ? parseInt(revisionLimit) : revisionLimit;

    const { data: listing, error } = await supabase
      .from('service_listings')
      .insert({
        provider_id: req.user.id,
        title,
        description,
        category,
        base_price_sats: basePriceSatsNum,
        price_type: priceType,
        delivery_time_days: deliveryTimeDaysNum,
        revision_limit: revisionLimitNum,
        images: Array.isArray(images) ? images : [],
        location: location || null,
        country: country || null,
        is_active: true,
        views: 0,
      })
      .select(`
        *,
        provider:profiles!service_listings_provider_id_fkey (
          id,
          username,
          display_name,
          avatar_url
        )
      `)
      .single();

    if (error) {
      throw new AppError('Failed to create listing', 500, 'DATABASE_ERROR');
    }

    res.status(201).json({
      success: true,
      message: 'Service listing created successfully',
      data: { listing },
    });
  } catch (error) {
    next(error);
  }
};

// Update service listing
export const updateListing = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError('User not authenticated', 401, 'UNAUTHORIZED');
    }

    const { id } = req.params;
    const {
      title,
      description,
      category,
      basePriceSats,
      priceType,
      deliveryTimeDays,
      revisionLimit,
      images,
      isActive,
      location,
      country,
    } = req.body;

    // Verify listing belongs to user
    const { data: existingListing } = await supabase
      .from('service_listings')
      .select('provider_id')
      .eq('id', id)
      .single();

    if (!existingListing) {
      throw new AppError('Listing not found', 404, 'LISTING_NOT_FOUND');
    }

    if (existingListing.provider_id !== req.user.id) {
      throw new AppError('Not authorized to update this listing', 403, 'FORBIDDEN');
    }

    // Build update object
    const updates: any = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (category !== undefined) updates.category = category;
    if (basePriceSats !== undefined) {
      updates.base_price_sats = typeof basePriceSats === 'string' ? parseInt(basePriceSats) : basePriceSats;
    }
    if (priceType !== undefined) updates.price_type = priceType;
    if (deliveryTimeDays !== undefined) {
      updates.delivery_time_days = deliveryTimeDays ? (typeof deliveryTimeDays === 'string' ? parseInt(deliveryTimeDays) : deliveryTimeDays) : null;
    }
    if (revisionLimit !== undefined) {
      updates.revision_limit = typeof revisionLimit === 'string' ? parseInt(revisionLimit) : revisionLimit;
    }
    if (images !== undefined) updates.images = Array.isArray(images) ? images : [];
    if (isActive !== undefined) updates.is_active = isActive;
    if (location !== undefined) updates.location = location || null;
    if (country !== undefined) updates.country = country || null;

    const { data: listing, error } = await supabase
      .from('service_listings')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        provider:profiles!service_listings_provider_id_fkey (
          id,
          username,
          display_name,
          avatar_url
        )
      `)
      .single();

    if (error) {
      throw new AppError('Failed to update listing', 500, 'DATABASE_ERROR');
    }

    res.json({
      success: true,
      message: 'Listing updated successfully',
      data: { listing },
    });
  } catch (error) {
    next(error);
  }
};

// Delete service listing
export const deleteListing = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError('User not authenticated', 401, 'UNAUTHORIZED');
    }

    const { id } = req.params;

    // Verify listing belongs to user
    const { data: existingListing } = await supabase
      .from('service_listings')
      .select('provider_id')
      .eq('id', id)
      .single();

    if (!existingListing) {
      throw new AppError('Listing not found', 404, 'LISTING_NOT_FOUND');
    }

    if (existingListing.provider_id !== req.user.id) {
      throw new AppError('Not authorized to delete this listing', 403, 'FORBIDDEN');
    }

    // Check if listing has active contracts
    const { data: activeContracts } = await supabase
      .from('service_contracts')
      .select('id')
      .eq('listing_id', id)
      .in('status', ['pending', 'in_progress']);

    if (activeContracts && activeContracts.length > 0) {
      // Deactivate instead of delete if there are active contracts
      await supabase
        .from('service_listings')
        .update({ is_active: false })
        .eq('id', id);

      res.json({
        success: true,
        message: 'Listing deactivated (has active contracts)',
      });
    } else {
      // Safe to delete
      const { error } = await supabase
        .from('service_listings')
        .delete()
        .eq('id', id);

      if (error) {
        throw new AppError('Failed to delete listing', 500, 'DATABASE_ERROR');
      }

      res.json({
        success: true,
        message: 'Listing deleted successfully',
      });
    }
  } catch (error) {
    next(error);
  }
};

// ============================================================================
// SERVICE CONTRACTS
// ============================================================================

// Create service contract
export const createContract = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError('User not authenticated', 401, 'UNAUTHORIZED');
    }

    const { listingId, milestones, autoCompleteDays = 14 } = req.body;

    if (!listingId || !milestones || !Array.isArray(milestones) || milestones.length === 0) {
      throw new AppError('Listing ID and milestones are required', 400, 'VALIDATION_ERROR');
    }

    // Get listing
    const { data: listing, error: listingError } = await supabase
      .from('service_listings')
      .select('*')
      .eq('id', listingId)
      .single();

    if (listingError || !listing) {
      throw new AppError('Listing not found', 404, 'LISTING_NOT_FOUND');
    }

    if (!listing.is_active) {
      throw new AppError('Listing is not available', 400, 'LISTING_NOT_AVAILABLE');
    }

    if (listing.provider_id === req.user.id) {
      throw new AppError('Cannot create contract for your own listing', 400, 'VALIDATION_ERROR');
    }

    // Calculate total price
    const totalPriceSats = milestones.reduce((sum: number, m: any) => {
      const amount = typeof m.amountSats === 'string' ? parseInt(m.amountSats) : m.amountSats;
      return sum + amount;
    }, 0);

    // Check buyer has sufficient balance
    const { data: buyerWallet } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', req.user.id)
      .single();

    if (!buyerWallet || buyerWallet.balance_sats < totalPriceSats) {
      throw new AppError('Insufficient balance', 400, 'INSUFFICIENT_BALANCE');
    }

    const autoCompleteDaysNum = typeof autoCompleteDays === 'string' ? parseInt(autoCompleteDays) : autoCompleteDays;

    // Create contract
    const { data: contract, error: contractError } = await supabase
      .from('service_contracts')
      .insert({
        listing_id: listingId,
        buyer_id: req.user.id,
        provider_id: listing.provider_id,
        total_price_sats: totalPriceSats,
        status: 'pending',
        auto_complete_days: autoCompleteDaysNum,
      })
      .select()
      .single();

    if (contractError) {
      throw new AppError('Failed to create contract', 500, 'DATABASE_ERROR');
    }

    // Create milestones
    const milestonePromises = milestones.map(async (milestone: any, index: number) => {
      const amountSats = typeof milestone.amountSats === 'string' ? parseInt(milestone.amountSats) : milestone.amountSats;
      const dueDate = milestone.dueDate ? new Date(milestone.dueDate) : null;

      // Create escrow for this milestone
      const { transaction, escrow } = await createEscrow({
        buyerId: req.user.id,
        sellerId: listing.provider_id,
        amountSats,
        relatedType: 'service_contract',
        relatedId: contract.id,
        autoReleaseDays: autoCompleteDaysNum,
      });

      // Create milestone
      const { data: milestoneData, error: milestoneError } = await supabase
        .from('service_milestones')
        .insert({
          contract_id: contract.id,
          milestone_number: index + 1,
          title: milestone.title,
          description: milestone.description,
          amount_sats: amountSats,
          transaction_id: transaction.id,
          escrow_id: escrow.id,
          status: 'pending',
          due_date: dueDate ? dueDate.toISOString() : null,
        })
        .select()
        .single();

      if (milestoneError) {
        // Rollback escrow if milestone creation fails
        await refundEscrow(escrow.id, 'Milestone creation failed');
        throw milestoneError;
      }

      // Update transaction and escrow related_id with milestone ID
      await supabase
        .from('transactions')
        .update({ related_id: milestoneData.id })
        .eq('id', transaction.id);

      return milestoneData;
    });

    try {
      await Promise.all(milestonePromises);
    } catch (error) {
      // Rollback contract if milestone creation fails
      await supabase.from('service_contracts').delete().eq('id', contract.id);
      throw new AppError('Failed to create milestones', 500, 'DATABASE_ERROR');
    }

    // Get contract with milestones
    const { data: contractWithMilestones } = await supabase
      .from('service_contracts')
      .select(`
        *,
        listing:service_listings(*),
        buyer:profiles!service_contracts_buyer_id_fkey (
          id,
          username,
          display_name,
          avatar_url
        ),
        provider:profiles!service_contracts_provider_id_fkey (
          id,
          username,
          display_name,
          avatar_url
        ),
        milestones:service_milestones(*)
      `)
      .eq('id', contract.id)
      .single();

    res.status(201).json({
      success: true,
      message: 'Contract created successfully',
      data: { contract: contractWithMilestones },
    });
  } catch (error) {
    next(error);
  }
};

// Get service contract
export const getContract = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError('User not authenticated', 401, 'UNAUTHORIZED');
    }

    const { id } = req.params;

    const { data: contract, error } = await supabase
      .from('service_contracts')
      .select(`
        *,
        listing:service_listings(*),
        buyer:profiles!service_contracts_buyer_id_fkey (
          id,
          username,
          display_name,
          avatar_url
        ),
        provider:profiles!service_contracts_provider_id_fkey (
          id,
          username,
          display_name,
          avatar_url
        ),
        milestones:service_milestones(
          *,
          deliverables:service_deliverables(*),
          revisions:service_revisions(*)
        )
      `)
      .eq('id', id)
      .single();

    if (error || !contract) {
      throw new AppError('Contract not found', 404, 'CONTRACT_NOT_FOUND');
    }

    // Verify user is buyer or provider
    if (contract.buyer_id !== req.user.id && contract.provider_id !== req.user.id) {
      throw new AppError('Not authorized to view this contract', 403, 'FORBIDDEN');
    }

    res.json({
      success: true,
      data: { contract },
    });
  } catch (error) {
    next(error);
  }
};

// Get user's contracts
export const getMyContracts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError('User not authenticated', 401, 'UNAUTHORIZED');
    }

    const { type = 'all', status, page = 1, limit = 20 } = req.query;

    let query = supabase
      .from('service_contracts')
      .select(`
        *,
        listing:service_listings(*),
        buyer:profiles!service_contracts_buyer_id_fkey (
          id,
          username,
          display_name,
          avatar_url
        ),
        provider:profiles!service_contracts_provider_id_fkey (
          id,
          username,
          display_name,
          avatar_url
        )
      `)
      .order('created_at', { ascending: false });

    // Filter by type: 'buying', 'providing', or 'all'
    if (type === 'buying') {
      query = query.eq('buyer_id', req.user.id);
    } else if (type === 'providing') {
      query = query.eq('provider_id', req.user.id);
    } else {
      query = query.or(`buyer_id.eq.${req.user.id},provider_id.eq.${req.user.id}`);
    }

    if (status) {
      query = query.eq('status', status);
    }

    // Pagination
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const from = (pageNum - 1) * limitNum;
    const to = from + limitNum - 1;

    query = query.range(from, to);

    const { data: contracts, error } = await query;

    if (error) {
      throw new AppError('Failed to fetch contracts', 500, 'DATABASE_ERROR');
    }

    res.json({
      success: true,
      data: {
        contracts: contracts || [],
        pagination: {
          page: pageNum,
          limit: limitNum,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Start contract (provider)
export const startContract = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError('User not authenticated', 401, 'UNAUTHORIZED');
    }

    const { id } = req.params;

    const { data: contract, error: contractError } = await supabase
      .from('service_contracts')
      .select('*')
      .eq('id', id)
      .single();

    if (contractError || !contract) {
      throw new AppError('Contract not found', 404, 'CONTRACT_NOT_FOUND');
    }

    if (contract.provider_id !== req.user.id) {
      throw new AppError('Only provider can start contract', 403, 'FORBIDDEN');
    }

    if (contract.status !== 'pending') {
      throw new AppError('Contract already started', 400, 'INVALID_CONTRACT_STATUS');
    }

    const { error: updateError } = await supabase
      .from('service_contracts')
      .update({
        status: 'in_progress',
        started_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (updateError) {
      throw new AppError('Failed to start contract', 500, 'DATABASE_ERROR');
    }

    res.json({
      success: true,
      message: 'Contract started',
    });
  } catch (error) {
    next(error);
  }
};

// Complete contract (provider)
export const completeContract = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError('User not authenticated', 401, 'UNAUTHORIZED');
    }

    const { id } = req.params;

    const { data: contract, error: contractError } = await supabase
      .from('service_contracts')
      .select('*')
      .eq('id', id)
      .single();

    if (contractError || !contract) {
      throw new AppError('Contract not found', 404, 'CONTRACT_NOT_FOUND');
    }

    if (contract.provider_id !== req.user.id) {
      throw new AppError('Only provider can complete contract', 403, 'FORBIDDEN');
    }

    if (contract.status !== 'in_progress') {
      throw new AppError('Contract must be in progress', 400, 'INVALID_CONTRACT_STATUS');
    }

    // Check all milestones are completed
    const { data: milestones } = await supabase
      .from('service_milestones')
      .select('status')
      .eq('contract_id', id);

    const allCompleted = milestones?.every((m) => m.status === 'completed');
    if (!allCompleted) {
      throw new AppError('All milestones must be completed first', 400, 'MILESTONES_NOT_COMPLETE');
    }

    const { error: updateError } = await supabase
      .from('service_contracts')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (updateError) {
      throw new AppError('Failed to complete contract', 500, 'DATABASE_ERROR');
    }

    res.json({
      success: true,
      message: 'Contract completed',
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================================
// MILESTONES
// ============================================================================

// Get milestone
export const getMilestone = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError('User not authenticated', 401, 'UNAUTHORIZED');
    }

    const { id } = req.params;

    const { data: milestone, error } = await supabase
      .from('service_milestones')
      .select(`
        *,
        contract:service_contracts(*),
        deliverables:service_deliverables(*),
        revisions:service_revisions(*)
      `)
      .eq('id', id)
      .single();

    if (error || !milestone) {
      throw new AppError('Milestone not found', 404, 'MILESTONE_NOT_FOUND');
    }

    // Verify user has access to this milestone's contract
    const contract = milestone.contract as any;
    if (!contract) {
      throw new AppError('Contract not found for milestone', 404, 'CONTRACT_NOT_FOUND');
    }

    if (contract.buyer_id !== req.user.id && contract.provider_id !== req.user.id) {
      throw new AppError('Not authorized to view this milestone', 403, 'FORBIDDEN');
    }

    res.json({
      success: true,
      data: { milestone },
    });
  } catch (error) {
    next(error);
  }
};

// Submit milestone deliverable (provider)
export const submitMilestone = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError('User not authenticated', 401, 'UNAUTHORIZED');
    }

    const { id } = req.params;
    const { deliverables } = req.body;

    // Get milestone with contract
    const { data: milestone, error: milestoneError } = await supabase
      .from('service_milestones')
      .select(`
        *,
        contract:service_contracts(*)
      `)
      .eq('id', id)
      .single();

    if (milestoneError || !milestone) {
      throw new AppError('Milestone not found', 404, 'MILESTONE_NOT_FOUND');
    }

    const contract = milestone.contract as any;
    if (contract.provider_id !== req.user.id) {
      throw new AppError('Only provider can submit milestone', 403, 'FORBIDDEN');
    }

    if (milestone.status !== 'pending' && milestone.status !== 'in_revision') {
      throw new AppError('Milestone cannot be submitted', 400, 'INVALID_MILESTONE_STATUS');
    }

    // Create deliverables
    if (deliverables && Array.isArray(deliverables) && deliverables.length > 0) {
      const deliverablePromises = deliverables.map((deliverable: any) =>
        supabase.from('service_deliverables').insert({
          milestone_id: id,
          file_url: deliverable.fileUrl,
          file_name: deliverable.fileName,
          description: deliverable.description,
        })
      );

      await Promise.all(deliverablePromises);
    }

    // Update milestone status
    const { error: updateError } = await supabase
      .from('service_milestones')
      .update({
        status: 'pending_approval',
        completed_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (updateError) {
      throw new AppError('Failed to submit milestone', 500, 'DATABASE_ERROR');
    }

    res.json({
      success: true,
      message: 'Milestone submitted for approval',
    });
  } catch (error) {
    next(error);
  }
};

// Approve milestone (buyer)
export const approveMilestone = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError('User not authenticated', 401, 'UNAUTHORIZED');
    }

    const { id } = req.params;

    // Get milestone with contract and escrow
    const { data: milestone, error: milestoneError } = await supabase
      .from('service_milestones')
      .select(`
        *,
        contract:service_contracts(*),
        escrow:escrow_accounts(*)
      `)
      .eq('id', id)
      .single();

    if (milestoneError || !milestone) {
      throw new AppError('Milestone not found', 404, 'MILESTONE_NOT_FOUND');
    }

    const contract = milestone.contract as any;
    if (contract.buyer_id !== req.user.id) {
      throw new AppError('Only buyer can approve milestone', 403, 'FORBIDDEN');
    }

    if (milestone.status !== 'pending_approval') {
      throw new AppError('Milestone is not pending approval', 400, 'INVALID_MILESTONE_STATUS');
    }

    // Release escrow to provider
    await releaseEscrow((milestone.escrow as any).id);

    // Update milestone status
    const { error: updateError } = await supabase
      .from('service_milestones')
      .update({
        status: 'completed',
        approved_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (updateError) {
      throw new AppError('Failed to approve milestone', 500, 'DATABASE_ERROR');
    }

    res.json({
      success: true,
      message: 'Milestone approved and payment released',
    });
  } catch (error) {
    next(error);
  }
};

// Request revision (buyer)
export const requestRevision = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError('User not authenticated', 401, 'UNAUTHORIZED');
    }

    const { id } = req.params;
    const { requestNotes } = req.body;

    // Get milestone with contract
    const { data: milestone, error: milestoneError } = await supabase
      .from('service_milestones')
      .select(`
        *,
        contract:service_contracts(*)
      `)
      .eq('id', id)
      .single();

    if (milestoneError || !milestone) {
      throw new AppError('Milestone not found', 404, 'MILESTONE_NOT_FOUND');
    }

    const contract = milestone.contract as any;
    if (contract.buyer_id !== req.user.id) {
      throw new AppError('Only buyer can request revision', 403, 'FORBIDDEN');
    }

    if (milestone.status !== 'pending_approval') {
      throw new AppError('Milestone must be pending approval to request revision', 400, 'INVALID_MILESTONE_STATUS');
    }

    // Get listing to check revision limit
    const { data: listing } = await supabase
      .from('service_listings')
      .select('revision_limit')
      .eq('id', contract.listing_id)
      .single();

    // Check revision limit
    const revisionLimit = listing?.revision_limit || 2;

    // Count existing revisions for this milestone
    const { count: revisionCount } = await supabase
      .from('service_revisions')
      .select('*', { count: 'exact', head: true })
      .eq('milestone_id', id);

    if ((revisionCount || 0) >= revisionLimit) {
      throw new AppError(`Revision limit (${revisionLimit}) reached`, 400, 'REVISION_LIMIT_REACHED');
    }

    // Create revision request
    const { data: revision, error: revisionError } = await supabase
      .from('service_revisions')
      .insert({
        milestone_id: id,
        revision_number: (revisionCount || 0) + 1,
        request_notes: requestNotes,
        status: 'pending',
      })
      .select()
      .single();

    if (revisionError) {
      throw new AppError('Failed to request revision', 500, 'DATABASE_ERROR');
    }

    // Update milestone status
    await supabase
      .from('service_milestones')
      .update({ status: 'in_revision' })
      .eq('id', id);

    res.json({
      success: true,
      message: 'Revision requested',
      data: { revision },
    });
  } catch (error) {
    next(error);
  }
};

