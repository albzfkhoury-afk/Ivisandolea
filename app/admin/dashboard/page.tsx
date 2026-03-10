"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MenuItem, CATEGORIES } from "@/lib/types";

export default function AdminDashboard() {
  const router = useRouter();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchMenu = async () => {
    try {
      const res = await fetch("/api/menu");
      if (res.ok) {
        setItems(await res.json());
      }
    } catch {
      // ignore
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const handleToggleAvailability = async (item: MenuItem) => {
    const res = await fetch("/api/menu", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: item.id, available: !item.available }),
    });
    if (res.status === 401) {
      router.push("/admin");
      return;
    }
    if (res.ok) {
      fetchMenu();
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    const res = await fetch(`/api/menu?id=${id}`, { method: "DELETE" });
    if (res.status === 401) {
      router.push("/admin");
      return;
    }
    if (res.ok) {
      fetchMenu();
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin");
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-olive-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-olive-900">Menu Management</h1>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setShowAddForm(true);
              setEditingItem(null);
            }}
            className="rounded-lg bg-olive-800 px-4 py-2 text-sm font-medium text-cream hover:bg-olive-900"
          >
            + Add Item
          </button>
          <button
            onClick={handleLogout}
            className="rounded-lg border border-olive-300 px-4 py-2 text-sm font-medium text-olive-700 hover:bg-olive-50"
          >
            Logout
          </button>
        </div>
      </div>

      {(showAddForm || editingItem) && (
        <ItemForm
          item={editingItem}
          onClose={() => {
            setShowAddForm(false);
            setEditingItem(null);
          }}
          onSaved={() => {
            setShowAddForm(false);
            setEditingItem(null);
            fetchMenu();
          }}
          onAuthError={() => router.push("/admin")}
        />
      )}

      {CATEGORIES.map((cat) => {
        const catItems = items.filter((i) => i.category === cat.id);
        if (catItems.length === 0) return null;
        return (
          <div key={cat.id} className="mb-6">
            <h2 className="mb-3 text-lg font-bold text-olive-800">
              {cat.name}
            </h2>
            <div className="space-y-2">
              {catItems.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center justify-between rounded-lg border p-3 ${
                    item.available
                      ? "border-olive-200 bg-white"
                      : "border-red-200 bg-red-50"
                  }`}
                >
                  <div className="flex-1">
                    <span className="font-medium text-olive-900">
                      {item.name}
                    </span>
                    <span className="ml-2 text-sm text-olive-600">
                      ${item.price}
                    </span>
                    {!item.available && (
                      <span className="ml-2 text-xs font-medium text-red-500">
                        UNAVAILABLE
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleAvailability(item)}
                      className={`rounded px-3 py-1 text-xs font-medium ${
                        item.available
                          ? "bg-red-100 text-red-700 hover:bg-red-200"
                          : "bg-green-100 text-green-700 hover:bg-green-200"
                      }`}
                    >
                      {item.available ? "Mark Unavailable" : "Mark Available"}
                    </button>
                    <button
                      onClick={() => {
                        setEditingItem(item);
                        setShowAddForm(false);
                      }}
                      className="rounded bg-olive-100 px-3 py-1 text-xs font-medium text-olive-700 hover:bg-olive-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id, item.name)}
                      className="rounded bg-red-100 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ItemForm({
  item,
  onClose,
  onSaved,
  onAuthError,
}: {
  item: MenuItem | null;
  onClose: () => void;
  onSaved: () => void;
  onAuthError: () => void;
}) {
  const [name, setName] = useState(item?.name || "");
  const [description, setDescription] = useState(item?.description || "");
  const [price, setPrice] = useState(item?.price?.toString() || "");
  const [category, setCategory] = useState(item?.category || CATEGORIES[0].id);
  const [subcategory, setSubcategory] = useState(item?.subcategory || "");
  const [available, setAvailable] = useState(item?.available !== false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      ...(item ? { id: item.id } : {}),
      name,
      description,
      price: parseFloat(price),
      category,
      subcategory: subcategory || undefined,
      available,
    };

    const res = await fetch("/api/menu", {
      method: item ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.status === 401) {
      onAuthError();
      return;
    }

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to save");
      setSaving(false);
      return;
    }

    onSaved();
  };

  return (
    <div className="mb-6 rounded-lg border border-olive-300 bg-white p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-bold text-olive-900">
          {item ? "Edit Item" : "Add New Item"}
        </h3>
        <button onClick={onClose} className="text-olive-500 hover:text-olive-700">
          Cancel
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-olive-700">
              Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded border border-olive-200 bg-cream px-3 py-2 text-sm outline-none focus:border-olive-500"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-olive-700">
              Price ($) *
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full rounded border border-olive-200 bg-cream px-3 py-2 text-sm outline-none focus:border-olive-500"
              required
            />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-olive-700">
            Description *
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded border border-olive-200 bg-cream px-3 py-2 text-sm outline-none focus:border-olive-500"
            required
          />
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-olive-700">
              Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded border border-olive-200 bg-cream px-3 py-2 text-sm outline-none focus:border-olive-500"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name} ({cat.type})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-olive-700">
              Subcategory
            </label>
            <input
              type="text"
              value={subcategory}
              onChange={(e) => setSubcategory(e.target.value)}
              className="w-full rounded border border-olive-200 bg-cream px-3 py-2 text-sm outline-none focus:border-olive-500"
              placeholder="e.g. White, Red, On Tap"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="available"
            checked={available}
            onChange={(e) => setAvailable(e.target.checked)}
            className="accent-olive-800"
          />
          <label htmlFor="available" className="text-sm text-olive-700">
            Available for ordering
          </label>
        </div>
        {error && (
          <div className="text-sm text-red-600">{error}</div>
        )}
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-olive-800 px-6 py-2 text-sm font-medium text-cream hover:bg-olive-900 disabled:opacity-50"
        >
          {saving ? "Saving..." : item ? "Update Item" : "Add Item"}
        </button>
      </form>
    </div>
  );
}
