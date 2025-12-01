import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  Button,
  Card,
  Empty,
  Modal,
  Select,
  Table,
  Spin,
  DatePicker,
  Space,
} from "antd";
import { Loader2 } from "lucide-react";
import dayjs from "dayjs";

import { useQuestionnaire } from "../../hooks/useQuestionnaire";
import { useAuth } from "../../context/AuthContext";

import { questionnaireService } from "../../service/questionnaireService";

import type { ColumnsType } from "antd/es/table";
import {
  HomeHeader,
  QuestionnaireCard,
  WelcomeBanner,
} from "./partials/HomeComponent";

const { RangePicker } = DatePicker;

interface HistoryData {
  id: string;
  createdAt: string;
  score?: number;
  questionnaire: {
    id: string;
    title: string;
  };
}

export default function Home() {
  const navigate = useNavigate();
  const {
    questionnaires,
    loading: quizLoading,
    error: quizError,
    refetch,
  } = useQuestionnaire();
  const { user, logout } = useAuth();

  console.log(questionnaires);

  const [history, setHistory] = useState<HistoryData[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  const [selectedQuizFilter, setSelectedQuizFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);

  // 1. Auth Check & Fetch Data
  // Tambahkan 'questionnaires' ke dependency agar saat data kuisioner masuk,
  // kita bisa mapping judulnya ke history.
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token && user) {
      logout();
      return;
    }

    fetchHistory();
  }, [questionnaires]); // Trigger ulang saat questionnaires siap

  useEffect(() => {
    if (quizError && quizError.includes("Gagal memuat kuisioner")) {
      const timer = setTimeout(() => refetch(), 2000);
      return () => clearTimeout(timer);
    }
  }, [quizError]);

  const fetchHistory = async () => {
    // Jangan set loading true jika ini adalah re-fetch karena questionnaires update
    if (history.length === 0) setHistoryLoading(true);

    try {
      const result = await questionnaireService.getHistory();

      // --- PERBAIKAN DISINI ---
      // Handle struktur data: API Anda mengembalikan { data: { data: [...] } }
      // Kita gunakan 'any' sementara untuk akses properti dinamis, atau sesuaikan interface service
      const responseData: any = result.data;
      const rawList = Array.isArray(responseData)
        ? responseData
        : responseData.data || responseData.submissions || [];

      // Mapping ke format HistoryData (menggabungkan ID dengan Title)
      const mappedData: HistoryData[] = rawList.map((item: any) => {
        // Cari judul berdasarkan ID yang ada di history
        const qId = item.QuestionnaireId || item.questionnaireId;
        const relatedQuiz = questionnaires.find((q) => q.id === qId);

        return {
          id: item.id || item.submissionId,
          createdAt: item.createdAt || item.submissionDate,
          score: item.score,
          questionnaire: {
            id: qId,
            // Jika questionnaire belum load, tampilkan placeholder atau ID-nya
            title: relatedQuiz ? relatedQuiz.title : "Memuat Judul...",
          },
        };
      });

      setHistory(mappedData);
    } catch (error) {
      console.error("Gagal memuat riwayat:", error);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleLogout = () => {
    Modal.confirm({
      title: "Konfirmasi Keluar",
      content: "Apakah Anda yakin ingin keluar dari aplikasi?",
      okText: "Ya, Keluar",
      cancelText: "Batal",
      okButtonProps: { danger: true },
      onOk: () => {
        logout();
        navigate("/masuk");
      },
    });
  };

  const handleStartQuiz = (quizId: string) => {
    navigate(`/quiz/${quizId}`);
  };

  const handleViewResult = (submissionId: string) => {
    navigate(`/result/${submissionId}`);
  };

  const getFilteredHistory = () => {
    let filtered = [...history];

    if (selectedQuizFilter !== "all") {
      filtered = filtered.filter(
        (item) => item.questionnaire.id === selectedQuizFilter
      );
    }

    if (dateRange) {
      const start = dayjs(dateRange[0]).startOf("day");
      const end = dayjs(dateRange[1]).endOf("day");
      filtered = filtered.filter((item) => {
        const itemDate = dayjs(item.createdAt);
        return itemDate.isAfter(start) && itemDate.isBefore(end);
      });
    }

    return filtered;
  };

  const historyColumns: ColumnsType<HistoryData> = [
    {
      title: "No",
      width: 60,
      align: "center",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Judul Kuisioner",
      dataIndex: ["questionnaire", "title"],
      key: "title",
      render: (text) => (
        <span className="font-medium text-gray-700">{text}</span>
      ),
    },
    {
      title: "Tanggal Pengerjaan",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => (
        <div className="flex flex-col">
          <span className="text-gray-700">
            {dayjs(date).format("DD MMMM YYYY")}
          </span>
          <span className="text-xs text-gray-400">
            {dayjs(date).format("HH:mm")} WIB
          </span>
        </div>
      ),
    },
    {
      title: "Aksi",
      key: "action",
      align: "center",
      width: 120,
      render: (_, record) => (
        <Button
          size="small"
          className="bg-[#70B748] hover:bg-[#5a9639] text-white border-none"
          onClick={() => handleViewResult(record.id)}
        >
          Lihat Hasil
        </Button>
      ),
    },
  ];

  const filteredHistoryData = getFilteredHistory();

  const publishedQuestionnaires = Array.isArray(questionnaires)
    ? questionnaires.filter((q) => q.status === "publish")
    : [];

  if (quizLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <Spin
          indicator={
            <Loader2 className="animate-spin text-[#70B748]" size={48} />
          }
        />
        <p className="text-gray-500 font-medium">Sedang memuat data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <HomeHeader fullname={user?.fullname || "User"} onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <WelcomeBanner fullname={user?.fullname || "User"} />

        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <span className="w-1 h-6 bg-[#70B748] rounded-full block"></span>
              Daftar Kuisioner Tersedia
            </h2>
          </div>

          {publishedQuestionnaires.length === 0 ? (
            <Empty
              description={
                <span className="text-gray-500">
                  Belum ada kuisioner yang tersedia saat ini.
                </span>
              }
              className="bg-white p-10 rounded-xl border border-gray-100 shadow-sm"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {publishedQuestionnaires.map((quiz) => (
                <QuestionnaireCard
                  key={quiz.id}
                  id={quiz.id}
                  title={quiz.title}
                  description={quiz.description}
                  onStart={handleStartQuiz}
                />
              ))}
            </div>
          )}
        </section>

        <section>
          <Card
            className="shadow-sm border-gray-200 rounded-xl overflow-hidden"
            title={
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
                <div className="flex items-center gap-2">
                  <span className="w-1 h-6 bg-orange-400 rounded-full block"></span>
                  <span className="text-xl font-bold text-gray-800">
                    Riwayat Pengerjaan
                  </span>
                </div>

                <Space wrap>
                  <Select
                    defaultValue="all"
                    className="w-48"
                    onChange={setSelectedQuizFilter}
                    options={[
                      { value: "all", label: "Semua Kuisioner" },
                      ...(questionnaires || []).map((q) => ({
                        value: q.id,
                        label: q.title,
                      })),
                    ]}
                  />
                  <RangePicker
                    onChange={(dates, dateStrings) => {
                      if (dates) setDateRange(dateStrings as [string, string]);
                      else setDateRange(null);
                    }}
                    className="w-64"
                  />
                </Space>
              </div>
            }
          >
            <Table<HistoryData>
              columns={historyColumns}
              dataSource={filteredHistoryData}
              rowKey="id"
              loading={historyLoading}
              pagination={{
                pageSize: 5,
                showTotal: (total) => `Total ${total} riwayat`,
              }}
              locale={{
                emptyText: (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="Belum ada riwayat pengerjaan"
                  />
                ),
              }}
            />
          </Card>
        </section>
      </main>
    </div>
  );
}
