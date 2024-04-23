import { useCallback, useState } from "react";
import FullCalendar from "@fullcalendar/react";

import type { DateSelectArg, EventApi, EventClickArg } from "@fullcalendar/core"

import dayGridPlugin from "@fullcalendar/daygrid";
import allLocales from '@fullcalendar/core/locales-all';
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import { INITIAL_EVENTS, createEventId } from './event-utils'
//import { Calendar, EventInput } from "@fullcalendar/core";

// モーダルを表示する関数
function showModal() {
    modal!.style.display = 'block';
}

// モーダルを非表示にする関数
function hideModal() {
    modal!.style.display = 'none';
}

// モーダルの表示
const modal = document.getElementById('modal');
const closeModal = document.getElementById('closeModal');

function App() {

  const [currentEvents, setCurrentEvents] = useState<EventApi[]>([]);
  const handleEvents = useCallback((events: EventApi[]) =>
    setCurrentEvents(events)
  , []);

  // カレンダーをクリックしたときの処理
  let countClick:boolean = true;
  // if( countClick == true){
  const handleDateSelect = useCallback((selectInfo: DateSelectArg) => {
    
    // モーダルウィンドウ(追加)の表示
    showModal();

    // モーダルウィンドウを閉じる
    closeModal!.addEventListener('click', hideModal);

    const formArea = document.querySelector('form');
    
    // フォームが入力された時の処理
    formArea!.addEventListener('submit', (e) => {
      
      // 選択したカレンダーの情報を取得
      const calendarApi = selectInfo.view.calendar;
      // calendarApi.unselect();

      e.preventDefault();



      // イベント内容の取得
      const title : string= e.target.title.value;
      const content :string = e.target.content.value;
      const start :string = e.target.start.value;
      const end :string = e.target.end.value;
      
      /*/
      let eventApi : string = calendarApi.getEventById('1');
      eventApi.setResources([ 'title', 'content', 'start', 'end' ]),
      /*/
      //if (title && content && start && end) {}
        calendarApi.addEvent({
        id: createEventId(),
        title,
        content,
        // 要確認
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay,
        })
      // console.log(end)
      // console.log(start)
      e.target.title.value = ""

      
      calendarApi.unselect();
      }
    )
      // console.log("2");
  }, []);

  const handleDateClick = useCallback((selectInfo: DateClickArg) => {
    // モーダルウィンドウ(追加)の表示
    showModal();

    // モーダルウィンドウを閉じる
    closeModal!.addEventListener('click', hideModal);

    const formArea = document.querySelector('form');
    
    // フォームが入力された時の処理
    formArea!.addEventListener('submit', (e) => {
      
      // 選択したカレンダーの情報を取得
      const calendarApi = selectInfo.view.calendar;
      // calendarApi.unselect();

      e.preventDefault();



      // イベント内容の取得
      const title : string= e.target.title.value;
      const content :string = e.target.content.value;
      
      /*/
      let eventApi : string = calendarApi.getEventById('1');
      eventApi.setResources([ 'title', 'content', 'start', 'end' ]),
      /*/
      //if (title && content && start && end) {}
        calendarApi.addEvent({
        id: createEventId(),
        title,
        content,
        // 要確認
        start: selectInfo.date,
        end: selectInfo.date,
        // allDay: selectInfo.allDay,
        })
      // console.log(end)
      // console.log(start)
      e.target.title.value = ""

      
      calendarApi.unselect();
      }
    )
  }, []);
// }
  // イベントクリック処理
  const handleEventClick = useCallback((clickInfo: EventClickArg) => {

    // 編集前のイベントを取得
    const beforeTitle : string= clickInfo.event._def.title
    const beforeContent :string = clickInfo.event._def.extendedProps.content;
    const beforeStart :string = clickInfo.event.startStr;
    const beforeEnd :string = clickInfo.event.endStr;  
    console.log (clickInfo.event.endStr);
    // console.log (clickInfo.event._instance.range.end);
    // モーダルウィンドウ(編集)の表示
    showModal();
    closeModal!.addEventListener('click', hideModal);
  }, []);

  /*/ イベント削除時の処理
  const handleEventClick = useCallback((clickInfo: EventClickArg) => {
    if (
      window.confirm(`このイベント「${clickInfo.event.title}」を編集しますか`)
    ) {
      clickInfo.event.remove();
    }
  }, []);
  /*/

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
          eventsSet={handleEvents}
          dateClick={handleDateClick}
          // select={handleDateSelect}
          eventClick={handleEventClick}
        />
      </div>
    </div>
  );
}

export default App;