import { useState } from "react";
import { Plus } from "lucide-react";
import { Link, useLocation } from "react-router";

export default function KelolaRwSection() {
	const pathSegments = useLocation().pathname.split("/").filter(Boolean);
	const [addRwPopUp, setAddRwPopUp] = useState(false);
	const [newJumlahRw, setNewJumlahRw] = useState<number>(1);

	const [rwData, setRwData] = useState([
		{ id: 1, name: "RW 1", jumlahRt: 2 },
		{ id: 2, name: "RW 2", jumlahRt: 2 },
		{ id: 3, name: "RW 3", jumlahRt: 2 },
		{ id: 4, name: "RW 4", jumlahRt: 2 },
		{ id: 5, name: "RW 5", jumlahRt: 2 },
	]);

	const totalRw = rwData.length;
	const totalRt = rwData.reduce((sum, rw) => sum + rw.jumlahRt, 0);

	const handleHapus = (id: number) => {
		setRwData(rwData.filter((rw) => rw.id !== id));
	};

	const handleTambahRw = (e: React.FormEvent) => {
		e.preventDefault();

		if (!newJumlahRw || newJumlahRw < 1) return;

		const lastId = rwData.length > 0 ? rwData[rwData.length - 1].id : 0;

		const newRws = Array.from({ length: newJumlahRw }, (_, i) => ({
			id: lastId + i + 1,
			name: `RW ${lastId + i + 1}`,
			jumlahRt: 2,
		}));

		setRwData([...rwData, ...newRws]);
		setNewJumlahRw(1);
		setAddRwPopUp(false);
	};

	const handleBatal = () => {
		setAddRwPopUp(false);
	};

	return (
		<>
			<main className="grid grid-cols-12 gap-6">
				<div className="col-span-6">
					<div className="bg-[#70B748] rounded-2xl p-6 text-white relative overflow-hidden min-h-[200px]">
						<div className="relative z-10">
							<h1 className="text-6xl font-bold">{totalRw} RW</h1>
						</div>
						<div className="absolute -right-7 -bottom-7">
							<img src="/home2.svg" alt="Home Icon" className="w-40 h-40" />
						</div>
					</div>
				</div>

				<div className="col-span-6">
					<div className="bg-[#70B748] rounded-2xl p-6 text-white relative overflow-hidden min-h-[200px]">
						<div className="relative z-10">
							<h1 className="text-6xl font-bold">{totalRt} RT</h1>
						</div>
						<div className="absolute -right-7 -bottom-7">
							<img src="/home2.svg" alt="Home Icon" className="w-40 h-40" />
						</div>
						<div className="absolute -right-10 -bottom-3">
							<img src="/home1.svg" alt="Home Icon" className="w-40 h-40" />
						</div>
					</div>
				</div>

				<div className="col-span-12">
					<div className="bg-[#70B748] rounded-2xl p-6">
						<div className="flex justify-between items-center mb-6">
							<h2 className="text-white text-xl font-semibold">Data RW</h2>
							<button
								onClick={() => setAddRwPopUp(true)}
								className="cursor-pointer bg-[#439017] hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
								<Plus size={16} />
								Tambah RW
							</button>
						</div>

						<div className="bg-white rounded-xl overflow-hidden">
							<table className="w-full">
								<thead>
									<tr className="bg-[#439017] text-white">
										<th className="text-left py-4 px-6 font-medium">Nama RW</th>
										<th className="text-left py-4 px-6 font-medium">Jumlah RT</th>
										<th className="text-left py-4 px-6 font-medium">Lihat</th>
										<th className="text-left py-4 px-6 font-medium">Hapus</th>
									</tr>
								</thead>
								<tbody>
									{rwData.map((rw, index) => (
										<tr
											key={rw.id}
											className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
											<td className="py-4 px-6 font-medium text-gray-900">{rw.name}</td>
											<td className="py-4 px-6 text-gray-700">{rw.jumlahRt}</td>
											<td className="py-4 px-6">
												<Link
													to={`/admin/kelola-rw/${rw.id}`}
													className="cursor-pointer bg-[#70B748] hover:bg-[#5a9639] text-white px-4 py-2 rounded-md font-medium min-w-[80px] transition-colors">
													Lihat
												</Link>
											</td>
											<td className="py-4 px-6">
												<button
													onClick={() => handleHapus(rw.id)}
													className="cursor-pointer bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
													Hapus
												</button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
						<div className="mt-4 text-white font-medium">
							<Link
								to={
									pathSegments[0] == "admin"
										? `/admin/responden`
										: `/admin-medis/responden`
								}
								className="hover:underline">
								Data RW
							</Link>{" "}
						</div>
					</div>
				</div>
			</main>

			{addRwPopUp && (
				<div className="absolute top-0 left-0 z-10 w-full h-full flex justify-center items-center bg-black/50">
					<div className="bg-white p-5 rounded-md space-y-5 w-[400px]">
						<h1 className="font-bold">Tambah RW</h1>
						<form onSubmit={handleTambahRw}>
							<ul className="space-y-6">
								<li className="space-y-2">
									<label className="block text-sm font-medium">Jumlah RW Baru</label>
									<input
										className="outline-none border w-full px-3 py-2 rounded-md"
										type="number"
										value={newJumlahRw}
										onChange={(e) => setNewJumlahRw(Number(e.target.value))}
										min={1}
									/>
								</li>
								<li className="flex gap-3">
									<button
										type="button"
										onClick={handleBatal}
										className="cursor-pointer w-full bg-red-400 hover:bg-red-500 text-white rounded-md p-2">
										Batal
									</button>
									<button
										type="submit"
										className="cursor-pointer w-full bg-[#70B748] hover:bg-green-600 text-white rounded-md p-2">
										Tambah
									</button>
								</li>
							</ul>
						</form>
					</div>
				</div>
			)}
		</>
	);
}
