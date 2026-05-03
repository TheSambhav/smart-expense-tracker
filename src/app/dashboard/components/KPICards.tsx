import { ArrowDownRight, ArrowUpRight, CreditCard, IndianRupee, PieChart } from "lucide-react";

export function KPICards({ data }: { data: any }) {
  const cards = [
    {
      title: "Total Spend",
      amount: data.totalSpend,
      icon: <ArrowDownRight className="text-red-500" />,
      color: "border-red-500/20",
      bg: "bg-red-500/10",
    },
    {
      title: "Total Income",
      amount: data.totalIncome,
      icon: <ArrowUpRight className="text-green-500" />,
      color: "border-green-500/20",
      bg: "bg-green-500/10",
    },
    {
      title: "Net Balance",
      amount: data.netBalance,
      icon: <IndianRupee className="text-blue-500" />,
      color: "border-blue-500/20",
      bg: "bg-blue-500/10",
    },
    {
      title: "Top Category",
      amount: data.topCategory,
      icon: <PieChart className="text-purple-500" />,
      color: "border-purple-500/20",
      bg: "bg-purple-500/10",
      isString: true,
    },
  ];

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(val);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <div key={i} className={`p-4 rounded-xl bg-gray-900 border border-gray-800 flex items-center gap-4 shadow-sm`}>
          <div className={`p-2.5 rounded-xl ${card.bg}`}>{card.icon}</div>
          <div>
            <p className="text-sm font-medium text-gray-400">{card.title}</p>
            <h3 className="text-xl font-bold text-white mt-0.5">
              {card.isString ? card.amount : formatCurrency(Number(card.amount))}
            </h3>
          </div>
        </div>
      ))}
    </div>
  );
}
