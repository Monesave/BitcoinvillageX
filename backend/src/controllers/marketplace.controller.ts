import { Request, Response, NextFunction } from 'express';
import { supabase } from '../services/supabase';
import { createEscrow, releaseEscrow, refundEscrow } from '../services/escrow.service';
import { AppError } from '@shared/utils';

// Get all marketplace listings
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
      .from('marketplace_listings')
      .select(`
        *,
        seller:profiles!marketplace_listings_seller_id_fkey (
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
      query = query.gte('price_sats', parseInt(minPrice as string));
    }

    if (maxPrice) {
      query = query.lte('price_sats', parseInt(maxPrice as string));
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

    const { data: listings, error, count } = await query;

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
          total: count || 0,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get single marketplace listing
export const getListing = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    // Get listing with seller info
    const { data: listing, error } = await supabase
      .from('marketplace_listings')
      .select(`
        *,
        seller:profiles!marketplace_listings_seller_id_fkey (
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
      .from('marketplace_listings')
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

// Create marketplace listing
export const createListing = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError('User not authenticated', 401, 'UNAUTHORIZED');
    }

    const {
      title,
      description,
      category,
      priceSats,
      currency = 'BTC',
      priceUsd,
      images = [],
      condition,
      shippingMethod,
      shippingCostSats = 0,
      location,
      country,
      latitude,
      longitude,
      radiusKm,
    } = req.body;

    // Validate required fields
    if (!title || !priceSats) {
      throw new AppError('Title and price are required', 400, 'VALIDATION_ERROR');
    }

    const priceSatsNum = typeof priceSats === 'string' ? parseInt(priceSats) : priceSats;
    const shippingCostSatsNum = typeof shippingCostSats === 'string' ? parseInt(shippingCostSats) : (shippingCostSats || 0);

    // Create listing
    const { data: listing, error } = await supabase
      .from('marketplace_listings')
      .insert({
        seller_id: req.user.id,
        title,
        description,
        category,
        price_sats: priceSatsNum,
        currency,
        price_usd: priceUsd ? (typeof priceUsd === 'string' ? parseFloat(priceUsd) : priceUsd) : null,
        images: Array.isArray(images) ? images : [],
        condition,
        shipping_method: shippingMethod,
        shipping_cost_sats: shippingCostSatsNum,
        location,
        country: country || null,
        latitude: latitude ? (typeof latitude === 'string' ? parseFloat(latitude) : latitude) : null,
        longitude: longitude ? (typeof longitude === 'string' ? parseFloat(longitude) : longitude) : null,
        radius_km: radiusKm ? (typeof radiusKm === 'string' ? parseInt(radiusKm) : radiusKm) : null,
        is_active: true,
        views: 0,
      })
      .select(`
        *,
        seller:profiles!marketplace_listings_seller_id_fkey (
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
      message: 'Listing created successfully',
      data: { listing },
    });
  } catch (error) {
    next(error);
  }
};

// Update marketplace listing
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
      priceSats,
      priceUsd,
      images,
      condition,
      shippingMethod,
      shippingCostSats,
      location,
      country,
      latitude,
      longitude,
      radiusKm,
      isActive,
    } = req.body;

    // Verify listing belongs to user
    const { data: existingListing } = await supabase
      .from('marketplace_listings')
      .select('seller_id')
      .eq('id', id)
      .single();

    if (!existingListing) {
      throw new AppError('Listing not found', 404, 'LISTING_NOT_FOUND');
    }

    if (existingListing.seller_id !== req.user.id) {
      throw new AppError('Not authorized to update this listing', 403, 'FORBIDDEN');
    }

    // Build update object
    const updates: any = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (category !== undefined) updates.category = category;
    if (priceSats !== undefined) {
      updates.price_sats = typeof priceSats === 'string' ? parseInt(priceSats) : priceSats;
    }
    if (priceUsd !== undefined) {
      updates.price_usd = priceUsd ? (typeof priceUsd === 'string' ? parseFloat(priceUsd) : priceUsd) : null;
    }
    if (images !== undefined) updates.images = Array.isArray(images) ? images : [];
    if (condition !== undefined) updates.condition = condition;
    if (shippingMethod !== undefined) updates.shipping_method = shippingMethod;
    if (shippingCostSats !== undefined) {
      updates.shipping_cost_sats = typeof shippingCostSats === 'string' ? parseInt(shippingCostSats) : (shippingCostSats || 0);
    }
    if (location !== undefined) updates.location = location;
    if (country !== undefined) updates.country = country || null;
    if (latitude !== undefined) {
      updates.latitude = latitude ? (typeof latitude === 'string' ? parseFloat(latitude) : latitude) : null;
    }
    if (longitude !== undefined) {
      updates.longitude = longitude ? (typeof longitude === 'string' ? parseFloat(longitude) : longitude) : null;
    }
    if (radiusKm !== undefined) {
      updates.radius_km = radiusKm ? (typeof radiusKm === 'string' ? parseInt(radiusKm) : radiusKm) : null;
    }
    if (isActive !== undefined) updates.is_active = isActive;

    const { data: listing, error } = await supabase
      .from('marketplace_listings')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        seller:profiles!marketplace_listings_seller_id_fkey (
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

// Delete marketplace listing
export const deleteListing = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError('User not authenticated', 401, 'UNAUTHORIZED');
    }

    const { id } = req.params;

    // Verify listing belongs to user
    const { data: existingListing } = await supabase
      .from('marketplace_listings')
      .select('seller_id')
      .eq('id', id)
      .single();

    if (!existingListing) {
      throw new AppError('Listing not found', 404, 'LISTING_NOT_FOUND');
    }

    if (existingListing.seller_id !== req.user.id) {
      throw new AppError('Not authorized to delete this listing', 403, 'FORBIDDEN');
    }

    // Check if listing has active orders
    const { data: activeOrders } = await supabase
      .from('marketplace_orders')
      .select('id')
      .eq('listing_id', id)
      .in('status', ['pending_payment', 'paid', 'shipped']);

    if (activeOrders && activeOrders.length > 0) {
      // Deactivate instead of delete if there are active orders
      await supabase
        .from('marketplace_listings')
        .update({ is_active: false })
        .eq('id', id);

      res.json({
        success: true,
        message: 'Listing deactivated (has active orders)',
      });
    } else {
      // Safe to delete
      const { error } = await supabase
        .from('marketplace_listings')
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

// Create marketplace order
export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError('User not authenticated', 401, 'UNAUTHORIZED');
    }

    const { listingId, quantity = 1, shippingAddress, shippingMethod, autoReleaseDays = 7 } = req.body;
    
    const quantityNum = typeof quantity === 'string' ? parseInt(quantity) : quantity;
    const autoReleaseDaysNum = typeof autoReleaseDays === 'string' ? parseInt(autoReleaseDays) : autoReleaseDays;

    if (!listingId || !shippingAddress) {
      throw new AppError('Listing ID and shipping address are required', 400, 'VALIDATION_ERROR');
    }

    // Get listing
    const { data: listing, error: listingError } = await supabase
      .from('marketplace_listings')
      .select('*')
      .eq('id', listingId)
      .single();

    if (listingError || !listing) {
      throw new AppError('Listing not found', 404, 'LISTING_NOT_FOUND');
    }

    if (!listing.is_active) {
      throw new AppError('Listing is not available', 400, 'LISTING_NOT_AVAILABLE');
    }

    if (listing.seller_id === req.user.id) {
      throw new AppError('Cannot purchase your own listing', 400, 'VALIDATION_ERROR');
    }

    // Calculate total price
    const totalPriceSats = (listing.price_sats + (listing.shipping_cost_sats || 0)) * quantity;

    // Check buyer has sufficient balance
    const { data: buyerWallet } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', req.user.id)
      .single();

    if (!buyerWallet || buyerWallet.balance_sats < totalPriceSats) {
      throw new AppError('Insufficient balance', 400, 'INSUFFICIENT_BALANCE');
    }

    // Create escrow
    const { transaction, escrow } = await createEscrow({
      buyerId: req.user.id,
      sellerId: listing.seller_id,
      amountSats: totalPriceSats,
      relatedType: 'marketplace_order',
      relatedId: listingId, // Will be updated with order ID
      autoReleaseDays,
    });

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('marketplace_orders')
      .insert({
        listing_id: listingId,
        buyer_id: req.user.id,
        seller_id: listing.seller_id,
        transaction_id: transaction.id,
        escrow_id: escrow.id,
        quantity: quantityNum,
        total_price_sats: totalPriceSats,
        shipping_address: shippingAddress,
        shipping_method: shippingMethod || listing.shipping_method,
        status: 'pending_payment',
        auto_release_days: autoReleaseDaysNum,
      })
      .select(`
        *,
        listing:marketplace_listings(*),
        buyer:profiles!marketplace_orders_buyer_id_fkey (
          id,
          username,
          display_name
        ),
        seller:profiles!marketplace_orders_seller_id_fkey (
          id,
          username,
          display_name
        )
      `)
      .single();

    if (orderError) {
      // Rollback escrow if order creation fails
      await refundEscrow(escrow.id, 'Order creation failed');
      throw new AppError('Failed to create order', 500, 'DATABASE_ERROR');
    }

    // Update transaction related_id with order ID (was listing ID before)
    await supabase
      .from('transactions')
      .update({ related_id: order.id })
      .eq('id', transaction.id);

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: { order },
    });
  } catch (error) {
    next(error);
  }
};

// Get marketplace order
export const getOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError('User not authenticated', 401, 'UNAUTHORIZED');
    }

    const { id } = req.params;

    const { data: order, error } = await supabase
      .from('marketplace_orders')
      .select(`
        *,
        listing:marketplace_listings(*),
        buyer:profiles!marketplace_orders_buyer_id_fkey (
          id,
          username,
          display_name,
          avatar_url
        ),
        seller:profiles!marketplace_orders_seller_id_fkey (
          id,
          username,
          display_name,
          avatar_url
        ),
        shipment:order_shipments(*),
        delivery:order_deliveries(*)
      `)
      .eq('id', id)
      .single();

    if (error || !order) {
      throw new AppError('Order not found', 404, 'ORDER_NOT_FOUND');
    }

    // Verify user is buyer or seller
    if (order.buyer_id !== req.user.id && order.seller_id !== req.user.id) {
      throw new AppError('Not authorized to view this order', 403, 'FORBIDDEN');
    }

    res.json({
      success: true,
      data: { order },
    });
  } catch (error) {
    next(error);
  }
};

// Get user's orders
export const getMyOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError('User not authenticated', 401, 'UNAUTHORIZED');
    }

    const { type = 'all', status, page = 1, limit = 20 } = req.query;

    let query = supabase
      .from('marketplace_orders')
      .select(`
        *,
        listing:marketplace_listings(*),
        buyer:profiles!marketplace_orders_buyer_id_fkey (
          id,
          username,
          display_name,
          avatar_url
        ),
        seller:profiles!marketplace_orders_seller_id_fkey (
          id,
          username,
          display_name,
          avatar_url
        )
      `)
      .order('created_at', { ascending: false });

    // Filter by type: 'buying', 'selling', or 'all'
    if (type === 'buying') {
      query = query.eq('buyer_id', req.user.id);
    } else if (type === 'selling') {
      query = query.eq('seller_id', req.user.id);
    } else {
      query = query.or(`buyer_id.eq.${req.user.id},seller_id.eq.${req.user.id}`);
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

    const { data: orders, error } = await query;

    if (error) {
      throw new AppError('Failed to fetch orders', 500, 'DATABASE_ERROR');
    }

    res.json({
      success: true,
      data: {
        orders: orders || [],
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

// Confirm order payment (for buyer)
export const confirmPayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError('User not authenticated', 401, 'UNAUTHORIZED');
    }

    const { id } = req.params;

    // Get order
    const { data: order, error: orderError } = await supabase
      .from('marketplace_orders')
      .select('*, escrow:escrow_accounts(*)')
      .eq('id', id)
      .single();

    if (orderError || !order) {
      throw new AppError('Order not found', 404, 'ORDER_NOT_FOUND');
    }

    if (order.buyer_id !== req.user.id) {
      throw new AppError('Only buyer can confirm payment', 403, 'FORBIDDEN');
    }

    if (order.status !== 'pending_payment') {
      throw new AppError('Order payment already confirmed', 400, 'ORDER_ALREADY_PAID');
    }

    // Update order status
    const { error: updateError } = await supabase
      .from('marketplace_orders')
      .update({ status: 'paid' })
      .eq('id', id);

    if (updateError) {
      throw new AppError('Failed to confirm payment', 500, 'DATABASE_ERROR');
    }

    // Update transaction status
    await supabase
      .from('transactions')
      .update({ status: 'completed' })
      .eq('id', order.transaction_id);

    res.json({
      success: true,
      message: 'Payment confirmed',
    });
  } catch (error) {
    next(error);
  }
};

// Confirm order delivery (for buyer)
export const confirmDelivery = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError('User not authenticated', 401, 'UNAUTHORIZED');
    }

    const { id } = req.params;

    // Get order with escrow
    const { data: order, error: orderError } = await supabase
      .from('marketplace_orders')
      .select('*, escrow:escrow_accounts(*)')
      .eq('id', id)
      .single();

    if (orderError || !order) {
      throw new AppError('Order not found', 404, 'ORDER_NOT_FOUND');
    }

    if (order.buyer_id !== req.user.id) {
      throw new AppError('Only buyer can confirm delivery', 403, 'FORBIDDEN');
    }

    if (order.status !== 'shipped') {
      throw new AppError('Order must be shipped before confirming delivery', 400, 'INVALID_ORDER_STATUS');
    }

    // Release escrow to seller
    await releaseEscrow((order.escrow as any).id);

    // Update order status
    await supabase
      .from('marketplace_orders')
      .update({ status: 'completed' })
      .eq('id', id);

    // Update delivery confirmation
    await supabase
      .from('order_deliveries')
      .update({ confirmed_by_buyer: true })
      .eq('order_id', id);

    res.json({
      success: true,
      message: 'Delivery confirmed and funds released to seller',
    });
  } catch (error) {
    next(error);
  }
};

