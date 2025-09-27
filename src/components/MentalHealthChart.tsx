import {
	PieChart,
	Pie,
	Cell,
	ResponsiveContainer,
	Legend,
	Tooltip,
} from "recharts";

export default function MentalHealthChart({
	overallDepressionRate,
	title = "Statistik Kesehatan Mental Warga",
	subtitle = "Persentase Kondisi Mental Warga di Semua RW",
}: {
	overallDepressionRate: number;
	title: string;
	subtitle: string;
}) {
	const data = [
		{
			name: "Warga Tidak Sehat Mental",
			value: overallDepressionRate,
			color: "#EF4444",
		},
		{
			name: "Warga Sehat Mental",
			value: 100 - overallDepressionRate,
			color: "#70B748",
		},
	];

	const CustomTooltip = ({
		active,
		payload,
	}: {
		active: string;
		payload: { name: string; value: string }[];
	}) => {
		if (active && payload && payload.length) {
			return (
				<div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
					<p className="font-medium text-gray-800">{payload[0].name}</p>
					<p className="text-sm text-gray-600">{payload[0].value}%</p>
				</div>
			);
		}
		return null;
	};

	return (
		<div className="bg-white rounded-xl p-6 shadow-sm">
			<div className="text-center mb-4">
				<h3 className="text-xl font-bold text-gray-800">{title}</h3>
				<p className="text-gray-600">{subtitle}</p>
			</div>

			<div className="h-70">
				<ResponsiveContainer width="100%" height="100%">
					<PieChart>
						<Pie
							data={data}
							cx="50%"
							cy="50%"
							innerRadius={60}
							outerRadius={120}
							paddingAngle={2}
							dataKey="value">
							{data.map((entry, index) => (
								<Cell key={`cell-${index}`} fill={entry.color} />
							))}
						</Pie>
						<Tooltip content={<CustomTooltip active={""} payload={[]} />} />
						<Legend
							verticalAlign="bottom"
							height={30}
							formatter={(value, entry) => (
								<span style={{ color: entry.color, fontWeight: "medium" }}>
									{value}
								</span>
							)}
						/>
					</PieChart>
				</ResponsiveContainer>
			</div>

			<div className="mt-4 grid grid-cols-2 gap-4">
				<div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
					<div className="text-2xl font-bold text-red-700">
						{overallDepressionRate}%
					</div>
					<div className="text-sm text-red-600">Tidak Sehat Mental</div>
				</div>
				<div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
					<div className="text-2xl font-bold text-green-700">
						{100 - overallDepressionRate}%
					</div>
					<div className="text-sm text-green-600">Sehat Mental</div>
				</div>
			</div>
		</div>
	);
}
