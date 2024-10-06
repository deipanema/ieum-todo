import Modal from "./Modal";

export default function LinkUpload() {
  return (
    <Modal type="child">
      <h1 className="mb-6 text-lg font-semibold">링크 업로드</h1>
      <div className="flex select-none flex-col gap-6">
        <div>
          <h2 className="mb-3 font-semibold">제목</h2>
          <input
            type="text"
            className="w-full rounded-xl bg-slate-50 px-6 py-3 focus:outline-none"
            placeholder="영상이나 글, 파일의 링크를 넣어주세요"
          />
        </div>
        <div>
          <button className="w-full rounded-xl bg-slate-400 py-3 text-white" disabled>
            확인
          </button>
        </div>
      </div>
    </Modal>
  );
}
