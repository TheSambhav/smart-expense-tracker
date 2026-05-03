"use client";

import { useState } from "react";
import { getTransactionsList } from "@/actions/transactions";

export function TransactionTable({ initialData }: { initialData: any }) {
  const [data, setData] = useState(initialData.data);
  const [meta, setMeta] = useState(initialData.meta);
  const [loading, setLoading] = useState(false);

  const fetchPage = async (page: number) => {
    setLoading(true);
    try {
      const res = await getTransactionsList(page, meta.limit);
      setData(res.data);
      setMeta(res.meta);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (val: number | string) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(Number(val));

  const formatDate = (dateStr: string) =>
    new Intl.DateTimeFormat("en-IN", { month: "short", day: "numeric", year: "numeric" }).format(new Date(dateStr));

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-sm">
      <div className="p-3.5 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
        <h3 className="font-semibold text-white">Recent Transactions</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-400 uppercase bg-gray-950/50 border-b border-gray-800">
            <tr>
              <th className="px-4 py-2.5 font-medium">Date</th>
              <th className="px-4 py-2.5 font-medium">Merchant</th>
              <th className="px-4 py-2.5 font-medium">Category</th>
              <th className="px-4 py-2.5 font-medium text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/50">
            {data.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                  No transactions found.
                </td>
              </tr>
            ) : (
              data.map((tx: any) => (
                <tr key={tx.id} className="hover:bg-gray-800/30 transition-colors">
                  <td className="px-4 py-2 text-gray-300">{formatDate(tx.date)}</td>
                  <td className="px-4 py-2 font-medium text-gray-200">{tx.merchant}</td>
                  <td className="px-4 py-2">
                    <span className="bg-gray-800 text-gray-300 text-[10px] px-2 py-0.5 rounded-md border border-gray-700">
                      {tx.category}
                    </span>
                  </td>
                  <td className={`px-4 py-2 text-right font-medium ${
                    tx.type === "INCOME" ? "text-green-500" : "text-white"
                  }`}>
                    {tx.type === "INCOME" ? "+" : "-"}{formatCurrency(tx.amount)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {meta.totalPages > 1 && (
        <div className="p-4 border-t border-gray-800 flex items-center justify-between bg-gray-900/50">
          <span className="text-sm text-gray-400">
            Showing <span className="font-medium text-white">{(meta.page - 1) * meta.limit + 1}</span> to{" "}
            <span className="font-medium text-white">{Math.min(meta.page * meta.limit, meta.total)}</span> of{" "}
            <span className="font-medium text-white">{meta.total}</span>
          </span>
          <div className="flex gap-2">
            <button
              disabled={meta.page === 1 || loading}
              onClick={() => fetchPage(meta.page - 1)}
              className="px-3 py-1.5 text-sm font-medium text-gray-300 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <button
              disabled={meta.page === meta.totalPages || loading}
              onClick={() => fetchPage(meta.page + 1)}
              className="px-3 py-1.5 text-sm font-medium text-gray-300 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
