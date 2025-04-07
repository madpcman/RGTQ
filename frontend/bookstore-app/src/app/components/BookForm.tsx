import { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Book } from "@/app/models/book";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/locale";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

registerLocale("ko", ko);

const BookSchema = z.object({
  title: z.string().min(1, "제목은 필수입니다."),
  author: z.string().min(1, "저자는 필수입니다."),
  detail: z.object({
    publisher: z.string().min(1, "출판사는 필수입니다."),
    publishedDate: z.date({ required_error: "발행일은 필수입니다." }),
    description: z.string().optional(),
    sellCount: z.number().min(0, "판매수량은 0 이상이어야 합니다."),
    stockCount: z.number().min(0, "재고수량은 0 이상이어야 합니다."),
  }),
});

type BookFormData = z.infer<typeof BookSchema>;

interface BookFormProps {
  initialData?: Partial<Book>;
  onSubmit?: (data: Partial<Book>) => void;
  submitLabel?: string;
  readOnly?: boolean;
}

export default function BookForm({
  initialData,
  onSubmit,
  submitLabel = "저장",
  readOnly = false,
}: BookFormProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    trigger,
    setValue,
    getValues,
  } = useForm<BookFormData>({
    resolver: zodResolver(BookSchema),
    defaultValues: {
      title: "",
      author: "",
      detail: {
        description: "",
        publisher: "",
        publishedDate: undefined,
        sellCount: 0,
        stockCount: 0,
      },
    },
  });

  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const dateInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title || "",
        author: initialData.author || "",
        detail: {
          description: initialData.detail?.description || "",
          publisher: initialData.detail?.publisher || "",
          publishedDate: initialData.detail?.publishedDate
            ? new Date(initialData.detail.publishedDate)
            : undefined,
          sellCount: initialData.detail?.sellCount || 0,
          stockCount: initialData.detail?.stockCount || 0,
        },
      });
    }
  }, [initialData, reset]);

  const inputClass = `w-full border p-2 rounded ${
    readOnly ? "bg-black text-white cursor-not-allowed opacity-70" : ""
  }`;

  const handleSellCountChange = (type: "add" | "remove") => {
    const currentSellCount = getValues("detail.sellCount");
    let newSellCount = type === "add" ? currentSellCount + 1 : currentSellCount - 1;
    if (newSellCount < 0) newSellCount = 0;
    setValue("detail.sellCount", newSellCount);
    trigger("detail.sellCount");

    const currentStock = getValues("detail.stockCount");
    let newStockCount = currentStock - 1;
    if (newStockCount < 0) newStockCount = 0;
    setValue("detail.stockCount", newStockCount);
    trigger("detail.stockCount");

    return newSellCount;
  };

  const handleStockCountChange = (type: "add" | "remove") => {
    const currentStock = getValues("detail.stockCount");
    let newStockCount = type === "add" ? currentStock + 1 : currentStock - 1;
    if (newStockCount < 0) newStockCount = 0;
    setValue("detail.stockCount", newStockCount);
    trigger("detail.stockCount");
    return newStockCount;
  };

  const handleFormSubmit = (data: BookFormData) => {
    const updatedData = {
      ...data,
      detail: {
        ...data.detail,
        sellCount: Math.max(0, data.detail.sellCount),
        stockCount: Math.max(0, data.detail.stockCount),
      },
    };

    if (onSubmit) {
      onSubmit(updatedData);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <input
          {...register("title")}
          placeholder="제목"
          disabled={readOnly}
          tabIndex={readOnly ? -1 : 0}
          className={inputClass}
        />
        {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
      </div>

      <div>
        <input
          {...register("author")}
          placeholder="저자"
          disabled={readOnly}
          tabIndex={readOnly ? -1 : 0}
          className={inputClass}
        />
        {errors.author && <p className="text-red-500 text-sm">{errors.author.message}</p>}
      </div>

      <div>
        <input
          {...register("detail.publisher")}
          placeholder="출판사"
          disabled={readOnly}
          tabIndex={readOnly ? -1 : 0}
          className={inputClass}
        />
        {errors.detail?.publisher && (
          <p className="text-red-500 text-sm">{errors.detail.publisher.message}</p>
        )}
      </div>

      <div>
        <div className="flex items-center gap-4">
          <label className="whitespace-nowrap font-medium">발행일</label>
          <div className="relative flex-1">
            <Controller
              name="detail.publishedDate"
              control={control}
              render={({ field }) => (
                <>
                  <input
                    ref={dateInputRef}
                    type="text"
                    value={field.value ? field.value.toISOString().split("T")[0] : ""}
                    placeholder="YYYY-MM-DD"
                    readOnly // <- 입력 방지
                    onFocus={(e) => {
                      if (!e.currentTarget.readOnly) {
                        setIsDatePickerOpen(true);
                      }
                    }}
                    className={inputClass + " pr-10 cursor-pointer"}
                  />

                  <DatePicker
                    locale="ko"
                    selected={field.value}
                    onChange={(date) => {
                      if (date) {
                        date.setHours(0, 0, 0, 0); // 시간 제거
                        field.onChange(date);
                        trigger("detail.publishedDate");
                      }
                      setIsDatePickerOpen(false);
                    }}
                    open={isDatePickerOpen}
                    onClickOutside={() => setIsDatePickerOpen(false)}
                    dateFormat="yyyy-MM-dd"
                    popperPlacement="bottom-start"
                    wrapperClassName="absolute"
                    className="hidden"
                    customInput={<input className="hidden" />}
                    disabled={readOnly}
                  />

                  <button
                    type="button"
                    onClick={() => setIsDatePickerOpen((prev) => !prev)}
                    disabled={readOnly}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 hover:text-black"
                  >
                    <CalendarMonthIcon />
                  </button>
                </>
              )}
            />
          </div>
        </div>
        {errors.detail?.publishedDate && (
          <p className="text-red-500 text-sm">{errors.detail.publishedDate.message}</p>
        )}
      </div>

      <div>
        <textarea
          {...register("detail.description")}
          placeholder="설명"
          disabled={readOnly}
          tabIndex={readOnly ? -1 : 0}
          className={inputClass}
        />
        {errors.detail?.description && (
          <p className="text-red-500 text-sm">{errors.detail.description.message}</p>
        )}
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="font-medium">판매수량</label>
          <input
            type="text"
            {...register("detail.sellCount", { valueAsNumber: true })}
            disabled={readOnly}
            className={inputClass}
          />
          {!readOnly && (
            <button
              type="button"
              onClick={() => handleSellCountChange("add")}
              className="bg-green-500 text-white p-2 rounded mt-2 w-full"
            >
              판매수량 추가
            </button>
          )}
        </div>

        <div className="flex-1">
          <label className="font-medium">재고수량</label>
          <input
            type="text"
            {...register("detail.stockCount", { valueAsNumber: true })}
            disabled={readOnly}
            className={inputClass}
          />
          {!readOnly && (
            <div className="flex gap-2 mt-2">
              <button
                type="button"
                onClick={() => handleStockCountChange("add")}
                className="bg-blue-500 text-white p-2 rounded w-full"
              >
                재고 추가
              </button>
              <button
                type="button"
                onClick={() => handleStockCountChange("remove")}
                className="bg-red-500 text-white p-2 rounded w-full"
              >
                재고 감소
              </button>
            </div>
          )}
        </div>
      </div>

      {!readOnly && (
        <button
          type="submit"
          disabled={isSubmitting || Object.keys(errors).length > 0}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {isSubmitting ? "처리 중..." : submitLabel}
        </button>
      )}
    </form>
  );
}
