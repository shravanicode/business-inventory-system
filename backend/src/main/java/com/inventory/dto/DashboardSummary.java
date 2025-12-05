package com.inventory.dto;

public class DashboardSummary {

    private long totalProducts;
    private long lowStockCount;
    private double totalRevenue;

    public DashboardSummary() {
    }

    public DashboardSummary(long totalProducts, long lowStockCount, double totalRevenue) {
        this.totalProducts = totalProducts;
        this.lowStockCount = lowStockCount;
        this.totalRevenue = totalRevenue;
    }

    public long getTotalProducts() { return totalProducts; }
    public long getLowStockCount() { return lowStockCount; }
    public double getTotalRevenue() { return totalRevenue; }

    public void setTotalProducts(long totalProducts) { this.totalProducts = totalProducts; }
    public void setLowStockCount(long lowStockCount) { this.lowStockCount = lowStockCount; }
    public void setTotalRevenue(double totalRevenue) { this.totalRevenue = totalRevenue; }
}
