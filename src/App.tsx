import { type EventContentArg, type EventInput } from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";
import { useCallback, useState } from "react";
import type { EventClickArg } from "@fullcalendar/core";
import allLocales from "@fullcalendar/core/locales-all";
import dayGridPlugin from "@fullcalendar/daygrid";
import type { DateClickArg } from "@fullcalendar/interaction";
import interactionPlugin from "@fullcalendar/interaction";
import { INITIAL_EVENTS, createEventId } from "./event-utils";
import type { EventImpl } from "@fullcalendar/core/internal";

function renderEventContent(eventInfo: EventContentArg) {
  return (
    <div>
      <div>タイトル: {eventInfo.event._def.title}</div>
      <div>内容: {eventInfo.event._def.extendedProps.content}</div>
      <div>開始時刻: {eventInfo.event._def.extendedProps.startDate}</div>
      <div>終了時刻: {eventInfo.event._def.extendedProps.endDate}</div>
    </div>
  );
}

function App() {
  // モーダルの開閉状態を管理
  const [showModal, setShowModal] = useState<boolean>(false);

  // モーダルを管理
  const [isShowedAddModal, setisShowAddModal] = useState<boolean>(false);

  // イベントの管理
  const [events, setEvents] = useState<EventInput[]>([]);

  // イベントの削除
  const [deleteEvent, setdeleteEvents] = useState<EventImpl>();

  // イベント日の管理
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // モーダルの内容を管理
  // [要素、更新関数] = useState< 型 >("初期値")
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [startDate, setstart] = useState<string>("");
  const [endDate, setend] = useState<string>("");

  const handleDateClick = useCallback(({ date }: DateClickArg): void => {
    // イベント日をセット
    setSelectedDate(date);
    console.log(date);

    // モーダルウィンドウ(追加)の表示
    setShowModal(true);
    setisShowAddModal(true);
  }, []);

  // 送信する押下時処理
  const handleClickSendButton = useCallback((): void => {
    // 選択された日がない場合はなにもせずreturn
    if (!title && !content) {
      return;
    }

    // イベント追加
    setEvents((prev: EventInput[]): EventInput[] => [
      ...prev,
      {
        id: createEventId(),
        title,
        content,
        startDate,
        endDate,
        date: selectedDate,
      },
    ]);

    // イベント内容をクリア
    setSelectedDate(null);
    setTitle("");
    setContent("");
    setstart("");
    setend("");

    // モーダルを閉じる
    setShowModal(false);
    setisShowAddModal(false);
  }, [content, endDate, selectedDate, startDate, title]);

  // イベントクリック時の表示処理
  const handleEventClick = useCallback(
    (clickInfo: EventClickArg) => {
      // 編集前のイベントを取得
      const beforeTitle: string = clickInfo.event._def.title;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const beforeContent: string = clickInfo.event._def.extendedProps.content;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const beforestart: string = clickInfo.event.extendedProps.startDate;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const beforeend: string = clickInfo.event.extendedProps.endDate;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const deleteEvent: EventImpl = clickInfo.event;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const date: Date | null = clickInfo.event.start;
      // const Event: EventImpl = clickInfo.event.getResources();

      // 各要素にセット
      setTitle(beforeTitle);
      setContent(beforeContent);
      setstart(beforestart);
      setend(beforeend);
      setdeleteEvents(deleteEvent);
      setSelectedDate(date);
      // clickInfo.view.calendar.select(,end?: DateMaker[]): void
      // console.log(clickInfo.view.calendar.currentDataManager.updateData());
      console.log(clickInfo);
      console.log(startDate);

      // モーダルウィンドウ(編集)の表示
      setShowModal(true);
    },
    [startDate]
  );

  // 更新する押下時処理
  const handleClickEditButton = useCallback((): void => {
    // イベントの中身がない場合はなにもせずreturn
    if (!title && !content) {
      return;
    }

    deleteEvent?.setExtendedProp(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      deleteEvent?._def.extendedProps.content,
      content
    );
    console.log(deleteEvent?.extendedProps.content);
    /*/
    deleteEvent?.setExtendedProp(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      deleteEvent.extendedProps.startDate,
      startDate
    );
    deleteEvent?.setExtendedProp(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      deleteEvent.extendedProps.endDate,
      endDate
    );
    // content;

     イベント更新
    setEvents((prev: EventInput[]): EventInput[] => [
      ...prev,
      {
        id: createEventId(),
        title,
        content,
        startDate,
        endDate,
        date: selectedDate,
      },
    ]);
    deleteEvent?.remove();
    /*/
    // イベント内容をクリア
    setSelectedDate(null);
    setTitle("");
    setContent("");
    setstart("");
    setend("");

    // モーダルを閉じる
    setShowModal(false);
  }, [content, endDate, selectedDate, startDate, title, deleteEvent]);

  // イベント削除時の処理
  const handleClickDeleteButton = useCallback((): void => {
    if (window.confirm(`このイベント「」を削除しますか`)) {
      deleteEvent?.remove();
    }

    // モーダルを閉じる
    setShowModal(false);
  }, [deleteEvent]);

  const handleChangeTitle = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      setTitle(event.target.value);
    },
    []
  );

  const handleChangeContent = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
      setContent(event.target.value);
    },
    []
  );

  const handleChangestart = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      setstart(event.target.value);
    },
    []
  );

  const handleChangeend = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      setend(event.target.value);
    },
    []
  );

  // リターン処理
  return (
    <div className="demo-app">
      <div className="demo-app-main">
        <FullCalendar
          contentHeight="auto"
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          selectable={true}
          unselectAuto={true}
          editable={true}
          initialEvents={INITIAL_EVENTS}
          locales={allLocales}
          locale="ja"
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          events={events}
          eventContent={renderEventContent}
        />
      </div>

      {/* showModal,isShowedAddModalがtrueのときだけ表示 */}
      {showModal && isShowedAddModal && (
        <div className="modal">
          <form>
            <div className="Form-Item">
              <p className="Form-Item-Label">タイトル</p>
              <input
                id="modal_title_input"
                type="text"
                className="Form-Item-Input"
                data-dismiss="modalTitle"
                name="title"
                value={title}
                onChange={handleChangeTitle}
              />
            </div>
            <div className="Form-Item">
              <p className="Form-Item-Label">内容</p>
              <textarea
                className="Form-Item-Textarea"
                cols={20}
                rows={3}
                name="content"
                value={content}
                onChange={handleChangeContent}
              />
            </div>
            <div className="Form-Item">
              <p className="Form-Item-Label">開始時刻</p>
              <input
                type="text"
                className="Form-Item-Input"
                placeholder="例）HH-MM-SS"
                value={startDate}
                onChange={handleChangestart}
              />
            </div>
            <div className="Form-Item">
              <p className="Form-Item-Label isMsg">終了時刻</p>
              <input
                type="text"
                className="Form-Item-Input"
                placeholder="例）HH-MM-SS"
                value={endDate}
                onChange={handleChangeend}
              />
            </div>
            <button
              type="button"
              className="Form-Btn"
              onClick={() => handleClickSendButton()}
            >
              送信する
            </button>
          </form>
          <button type="button" onClick={() => setShowModal(false)}>
            閉じる
          </button>
        </div>
      )}

      {/* showModalがtrue,isShowedAddModalがfalseのときだけ表示 */}
      {showModal && !isShowedAddModal && (
        <div className="modal">
          <form>
            <div className="Form-Item">
              <p className="Form-Item-Label">タイトル</p>
              <input
                id="modal_title_input"
                type="text"
                className="Form-Item-Input"
                data-dismiss="modalTitle"
                name="title"
                value={title}
                onChange={handleChangeTitle}
              />
            </div>
            <div className="Form-Item">
              <p className="Form-Item-Label">内容</p>
              <textarea
                className="Form-Item-Textarea"
                cols={20}
                rows={3}
                name="content"
                value={content}
                onChange={handleChangeContent}
              />
            </div>
            <div className="Form-Item">
              <p className="Form-Item-Label">開始時刻</p>
              <input
                type="text"
                className="Form-Item-Input"
                placeholder="例）HH-MM-SS"
                value={startDate}
                onChange={handleChangestart}
              />
            </div>
            <div className="Form-Item">
              <p className="Form-Item-Label isMsg">終了時刻</p>
              <input
                type="text"
                className="Form-Item-Input"
                placeholder="例）HH-MM-SS"
                value={endDate}
                onChange={handleChangeend}
              />
            </div>
            <button
              type="button"
              className="Form-Btn"
              onClick={() => handleClickEditButton()}
            >
              更新する
            </button>
          </form>
          <button type="button" onClick={() => setShowModal(false)}>
            閉じる
          </button>
          <button
            type="button"
            id="deleteButton"
            onClick={() => handleClickDeleteButton()}
          >
            削除する
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
