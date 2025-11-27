import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Link, useLocation } from "react-router";
import { AxiosError } from "axios";
import {
	adminDesaService,
	type RtResponse,
} from "../../../service/adminDesaService";

export default function KelolaRtSection({ rwId }: { rwId: string }) {
	const location = useLocation();
	const pathSegments = location.pathname.split("/").filter(Boolean);

	const [addRtPopUp, setAddRtPopUp] = useState(false);
	const [newJumlahRt, setNewJumlahRt] = useState<number>();
	const [rt, setRt] = useState<RtResponse | null>(null);
	const [rwName, setRwName] = useState("");

	useEffect(() => {
		if (!pathSegments[2]) return;

		const getRt = async () => {
			try {
				const response = await adminDesaService.getRT(pathSegments[2]);
				setRt(response);
				setRwName(`RW ${response.data.name}`);
			} catch (err) {
				console.error("Error fetching RT:", err as AxiosError);
			}
		};

		getRt();
	}, []);

	const handleHapus = async (rtId: string) => {
		const confirmDelete = window.confirm(
			"Apakah Anda yakin ingin menghapus RT ini?"
		);
		if (!confirmDelete) return;

		try {
			await adminDesaService.deleteRT(rtId);
			window.location.reload();
		} catch (err) {
			console.error("Error deleting RT:", err as AxiosError);
			alert("Gagal menghapus RT");
		}
	};

	const handleTambahRt = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!newJumlahRt || newJumlahRt < 1) return;

		try {
			await adminDesaService.addRT(newJumlahRt, rwId);
			window.location.reload();
		} catch (err) {
			console.error("Error adding RT:", err as AxiosError);
			alert("Gagal menambahkan RT");
		}
	};

	const BreadcrumbLink =
		pathSegments[0] === "admin" ? `/admin/kelola-rw` : `/admin-medis/kelola-rw`;

	const handleBatal = () => setAddRtPopUp(false);

	return (
		<>
			<main className="grid grid-cols-12 gap-6">
				{/* KARTU JUMLAH RT */}
				<div className="col-span-6">
					<div className="bg-gray-100 rounded-2xl p-6 relative overflow-hidden min-h-[200px] shadow-sm">
						<div className="relative z-10">
							<h1 className="text-[#70B748] text-6xl font-bold">
								{rt?.metadata?.rtCount}
							</h1>
							<p className="text-gray-600 text-lg mt-2">Total RT</p>
						</div>
						<div className="absolute -right-7 -bottom-7">
							<img src="/home2.svg" alt="Home Icon" className="w-40 h-40" />
						</div>
					</div>
				</div>

				{/* KARTU JUMLAH WARGA */}
				<div className="col-span-6">
					<div className="bg-gray-100 rounded-2xl p-6 relative overflow-hidden min-h-[200px] shadow-sm">
						<div className="relative z-10">
							<h1 className="text-[#70B748] text-6xl font-bold">
								{rt?.metadata?.userCount}
							</h1>
							<p className="text-gray-600 text-lg mt-2">Total Warga</p>
						</div>
						<div className="absolute -right-7 -bottom-7">
							<img src="/home2.svg" alt="Home Icon" className="w-40 h-40" />
						</div>
					</div>
				</div>

				{/* TABEL */}
				<div className="col-span-12">
					<div className="bg-gray-100 rounded-2xl p-6 shadow-sm">
						<div className="flex justify-between items-center pb-3">
							<div className="text-gray-600 font-medium">
								<Link to={BreadcrumbLink} className="hover:underline">
									Kelola RW
								</Link>{" "}
								/{" "}
								<span className="text-gray-800 font-medium">
									{rwName || `RW ${rwId}`}
								</span>
							</div>

							<button
								onClick={() => setAddRtPopUp(true)}
								className="cursor-pointer bg-[#70B748] hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
								<Plus size={16} />
								Tambah RT
							</button>
						</div>

						<div className="bg-white rounded-xl overflow-hidden shadow-sm">
							<div className="bg-[#70B748] text-white">
								<div className="grid grid-cols-12 py-4 px-6 text-sm sm:text-base">
									<div className="col-span-3 font-semibold">Nama RT</div>
									<div className="col-span-2 text-center font-semibold">Total Warga</div>
									<div className="col-span-3 text-center font-semibold">
										Kelola Warga
									</div>
									<div className="col-span-2 text-center font-semibold">Aksi</div>
								</div>
							</div>

							<div className="divide-y divide-gray-200">
								{rt?.data?.rukunTetangga.length === 0 ? (
									<div className="py-8 text-center text-gray-500">
										<p>Belum ada data RT di {rwName || rwId}.</p>
										<p className="text-sm mt-2">Tambahkan RT baru untuk memulai.</p>
									</div>
								) : (
									rt?.data?.rukunTetangga.map((rtItem, index) => (
										<div
											key={rtItem.id}
											className={`grid grid-cols-12 py-4 px-6 text-sm sm:text-base hover:bg-gray-50 ${
												index % 2 === 0 ? "bg-white" : "bg-gray-50"
											}`}>
											<div className="col-span-3 text-gray-700 font-medium">
												RT {rtItem.name}
											</div>

											<div className="col-span-2 text-center text-gray-700">
												{rtItem.totalWarga}
											</div>

											<div className="col-span-3 text-center">
												<Link
													to={
														pathSegments[0] === "admin"
															? `/admin/kelola-rw/${rwId}/${rtItem.id}`
															: `/admin-medis/kelola-rw/${rwId}/${rtItem.id}`
													}
													className="cursor-pointer bg-[#70B748] hover:bg-[#5a9639] text-white px-4 py-2 rounded-md font-medium min-w-[80px] transition-colors inline-block">
													Kelola Warga
												</Link>
											</div>

											<div className="col-span-2 text-center">
												<button
													onClick={() => handleHapus(rtItem.id)}
													className="cursor-pointer bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
													Hapus
												</button>
											</div>
										</div>
									))
								)}
							</div>
						</div>
					</div>
				</div>
			</main>

			{addRtPopUp && (
				<div className="fixed top-0 left-0 z-50 w-full h-full flex justify-center items-center bg-black/50">
					<div className="bg-white p-5 rounded-md space-y-5 w-[400px]">
						<h1 className="font-bold text-lg">Tambah RT Baru</h1>

						<form onSubmit={handleTambahRt}>
							<ul className="space-y-6">
								<li className="space-y-2">
									<label className="block text-sm font-medium text-gray-700">
										Jumlah RT Baru
									</label>
									<input
										type="number"
										max={10}
										value={newJumlahRt}
										onChange={(e) => setNewJumlahRt(Number(e.target.value))}
										className="outline-none border border-gray-300 w-full px-3 py-2 rounded-md focus:border-[#70B748] focus:ring-1 focus:ring-[#70B748]"
									/>
									<p className="text-sm text-gray-500">
										Maksimal 10 RT dapat ditambahkan sekaligus
									</p>
								</li>

								<li className="flex gap-3 pt-4">
									<button
										type="button"
										onClick={handleBatal}
										className="cursor-pointer w-full bg-gray-400 hover:bg-gray-500 text-white rounded-md p-3 font-medium transition-colors">
										Batal
									</button>
									<button
										type="submit"
										className="cursor-pointer w-full bg-[#70B748] hover:bg-green-600 text-white rounded-md p-3 font-medium transition-colors">
										Tambah RT
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
