"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { productApi, categoryApi } from "@/lib/api-client";
import { Plus, Search, Edit, Trash2, Eye, Package, Loader2, Save, X } from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function AdminProductsPage() {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<any>(null);
  const [isSlowLoad, setIsSlowLoad] = useState(false);

  // Detect slow DB wake-up
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (loading) {
      timer = setTimeout(() => setIsSlowLoad(true), 3000);
    } else {
      setIsSlowLoad(false);
    }
    return () => clearTimeout(timer);
  }, [loading]);

  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    price: 0,
    discountPrice: 0,
    stockQuantity: 0,
    categoryId: "",
    description: "",
    brand: "",
    imageUrl: "",
    isFeatured: false,
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { products: data } = await productApi.getProducts();
      setProducts(data);
    } catch (error) {
      console.error("Failed to load admin products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { categories: data } = await categoryApi.getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const resetForm = () => {
    setFormData({
      name: "",
      sku: "",
      price: 0,
      discountPrice: 0,
      stockQuantity: 0,
      categoryId: "",
      description: "",
      brand: "",
      imageUrl: "",
      isFeatured: false,
    });
    setCurrentProduct(null);
  };

  const handleEdit = (product: any) => {
    setCurrentProduct(product);
    setFormData({
      name: product.name,
      sku: product.sku,
      price: product.price,
      discountPrice: product.discountPrice || 0,
      stockQuantity: product.stockQuantity,
      categoryId: product.categoryId,
      description: product.description,
      brand: product.brand || "",
      imageUrl: product.images?.[0] || product.imageUrl || "",
      isFeatured: product.isFeatured || false,
    });
    setDialogOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const slug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const { imageUrl, ...restFormData } = formData;
      const data = {
        ...restFormData,
        slug,
        price: Number(formData.price),
        discountPrice: formData.discountPrice ? Number(formData.discountPrice) : null,
        stockQuantity: Number(formData.stockQuantity),
        brand: formData.brand || undefined,
        images: imageUrl ? [imageUrl] : [],
      };
      
      if (currentProduct) {
        await productApi.updateProduct(currentProduct.id, data);
      } else {
        await productApi.createProduct(data);
      }
      
      setDialogOpen(false);
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error("Failed to save product:", error);
      alert("Error saving product. Please check console.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    try {
      await productApi.deleteProduct(id);
      fetchProducts();
    } catch (error) {
      console.error("Failed to delete product:", error);
      alert("Error deleting product.");
    }
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Package className="w-6 h-6" style={{ color: "hsl(var(--accent))" }} /> Product Management
          </h1>
          <p className="text-sm text-muted-foreground">{products.length} products in catalog</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="text-white" style={{ backgroundColor: "hsl(var(--cta))" }} onClick={() => { resetForm(); setDialogOpen(true); }}>
              <Plus className="w-4 h-4 mr-2" /> Add New Product
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{currentProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
              <DialogDescription>
                Fill in the details below to {currentProduct ? "update the" : "list a new"} product in the catalog.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSave} className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase">Product Name</label>
                  <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="e.g. Arduino Uno R3" required />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase">SKU Code</label>
                  <Input value={formData.sku} onChange={(e) => setFormData({...formData, sku: e.target.value})} placeholder="e.g. ARD-UNO-001" required />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase">Base Price (₹)</label>
                  <Input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: Number(e.target.value)})} required />
                  <p className="text-[10px] text-muted-foreground">
                    + 18% GST (₹{(formData.price * 0.18).toFixed(2)}) = <span className="font-medium text-foreground">₹{(formData.price * 1.18).toFixed(2)}</span>
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase">Discount Price (₹)</label>
                  <Input type="number" value={formData.discountPrice} onChange={(e) => setFormData({...formData, discountPrice: Number(e.target.value)})} />
                  {formData.discountPrice > 0 && (
                    <p className="text-[10px] text-muted-foreground">
                      + 18% GST (₹{(formData.discountPrice * 0.18).toFixed(2)}) = <span className="font-medium text-foreground">₹{(formData.discountPrice * 1.18).toFixed(2)}</span>
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase">Stock Qty</label>
                  <Input type="number" value={formData.stockQuantity} onChange={(e) => setFormData({...formData, stockQuantity: Number(e.target.value)})} required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase">Category</label>
                  <select 
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.categoryId} 
                    onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase">Brand</label>
                  <Input value={formData.brand} onChange={(e) => setFormData({...formData, brand: e.target.value})} placeholder="e.g. Arduino" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Image URL</label>
                <Input value={formData.imageUrl} onChange={(e) => setFormData({...formData, imageUrl: e.target.value})} placeholder="https://..." />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Description</label>
                <textarea 
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.description} 
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Detailed product description..."
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="featured" 
                  checked={formData.isFeatured} 
                  onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="featured" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Feature this product on homepage
                </label>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>Cancel</Button>
                <Button type="submit" disabled={saving} className="text-white" style={{ backgroundColor: "hsl(var(--cta))" }}>
                  {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                  {currentProduct ? "Update Product" : "Save Product"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search Bar */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by product name or SKU..."
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30 text-left text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Product</th>
                  <th className="px-4 py-3 font-medium">SKU</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Price</th>
                  <th className="px-4 py-3 font-medium">Stock</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-3 text-muted-foreground">
                        <Loader2 className="w-8 h-8 animate-spin text-accent" />
                        <div className="space-y-1">
                          <p className="font-medium text-foreground">Syncing catalog...</p>
                          {isSlowLoad && (
                            <p className="text-xs text-orange-500 animate-pulse bg-orange-500/10 px-3 py-1 rounded-full">
                              Waking up database... this may take up to 30 seconds.
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : filtered.map((product) => {
                  const stock = product.stockQuantity ?? product.stock ?? 0;
                  const imageUrl = product.images?.[0] || product.imageUrl;
                  const categoryName = product.category?.name || product.category || "Uncategorized";
                  
                  return (
                    <tr key={product.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-muted/30 rounded-md shrink-0 flex items-center justify-center overflow-hidden">
                            {imageUrl ? (
                              <img src={imageUrl} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-[8px] text-muted-foreground/30">IMG</span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium line-clamp-1 max-w-[200px]">{product.name}</p>
                            <p className="text-xs text-muted-foreground">{product.brand || "Generic"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs">{product.sku}</td>
                      <td className="px-4 py-3 text-muted-foreground">{categoryName}</td>
                      <td className="px-4 py-3">
                        <div>
                          <span className="font-semibold" style={{ color: "hsl(var(--accent))" }}>₹{(product.discountPrice ?? product.price).toLocaleString()}</span>
                          {product.discountPrice && (
                            <span className="text-xs text-muted-foreground line-through ml-1">₹{product.price.toLocaleString()}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          stock === 0 ? "bg-red-100 text-red-700" :
                          stock <= 20 ? "bg-orange-100 text-orange-700" :
                          "bg-green-100 text-green-700"
                        }`}>{stock}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          product.isFeatured ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"
                        }`}>{product.isFeatured ? "Featured" : product.status || "Active"}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Link href={`/products/${product.slug}`}>
                            <Button variant="ghost" size="sm"><Eye className="w-3.5 h-3.5" /></Button>
                          </Link>
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(product)}><Edit className="w-3.5 h-3.5" /></Button>
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleDelete(product.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {!loading && filtered.length === 0 && (
            <div className="text-center py-10 text-muted-foreground">
              <p className="text-lg font-semibold">No products found</p>
              <p className="text-sm mt-1">Try a different search term</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
