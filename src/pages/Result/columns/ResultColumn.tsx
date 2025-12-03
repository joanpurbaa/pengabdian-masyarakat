import type { ColumnsType } from "antd/es/table";

export interface UserQuestionResult {
    no: number;
    question: string;
    answer: string;
}

export const getUserResultColumns = (): ColumnsType<UserQuestionResult> => [
    {
        title: "No",
        dataIndex: "no",
        key: "no",
        width: 80,
        align: "center",
        responsive: ["sm"],
    },
    {
        title: "Pertanyaan",
        dataIndex: "question",
        key: "question",
    },
    {
        title: "Jawaban",
        dataIndex: "answer",
        key: "answer",
        width: 150,
        align: "center",
        render: (value: string) => (
            <span
                className={`px-4 py-1 rounded-md text-white text-sm font-medium ${
                    value === "Ya" ? "!bg-[#70B748]" : "bg-gray-500"
                }`}
            >
                {value}
            </span>
        ),
    },
];