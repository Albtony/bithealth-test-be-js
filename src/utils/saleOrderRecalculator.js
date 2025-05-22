// utils/saleOrderRecalculator.js

const db = require('../models'); // Adjust path to your db object

/**
 * Recalculates and updates both the gross total_price and total_billed_price
 * for a given SaleOrder, considering SaleOrderItem statuses.
 * @param {string} orderId The UUID of the SaleOrder to recalculate.
 * @param {object} [transaction=null] An optional Sequelize transaction object.
 */
async function recalculateOrderTotals(orderId, transaction = null) {
    if (!db.SaleOrder || !db.SaleOrderItem) {
        console.error("Database models (SaleOrder or SaleOrderItem) not initialized in db object.");
        return;
    }

    const SaleOrder = db.SaleOrder;
    const SaleOrderItem = db.SaleOrderItem;

    // Fetch all items for the given order, including their subtotal and status
    const items = await SaleOrderItem.findAll({
        where: { order_id: orderId },
        attributes: ['subtotal', 'status'], // Still fetching 'status' from SaleOrderItem
        transaction,
    });

    let newGrossTotalPrice = 0;
    let newBilledTotalPrice = 0;

    // Define which SaleOrderItem statuses should contribute to the 'total_billed_price'.
    // Adjust these statuses based on your specific business rules for what's considered 'billable'.
    const billableStatuses = ['PENDING', 'PROCESSING', 'COMPLETED'];
    // For example, if 'BACKORDERED' items are billed upfront, you'd add 'BACKORDERED' here.
    // If 'CANCELLED' or 'REFUNDED' items are never part of the billed total, ensure they're not in this list.


    for (const item of items) {
        const itemSubtotal = parseFloat(item.subtotal);

        // Always include in the gross total_price (original order value)
        newGrossTotalPrice += itemSubtotal;

        // Include in total_billed_price only if the item's status is considered 'billable'
        if (billableStatuses.includes(item.status)) {
            newBilledTotalPrice += itemSubtotal;
        }
    }

    // Update the SaleOrder with both calculated totals
    await SaleOrder.update(
        {
            total_price: newGrossTotalPrice.toFixed(2),       // Gross total
            total_billed_price: newBilledTotalPrice.toFixed(2) // Total considering status
        },
        { where: { order_id: orderId }, transaction }
    );

    console.log(`Order ${orderId} totals recalculated: Gross: ${newGrossTotalPrice.toFixed(2)}, Billed: ${newBilledTotalPrice.toFixed(2)}`);
}

module.exports = recalculateOrderTotals;