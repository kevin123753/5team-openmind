/****** dayjs 라이브러리 ******/
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "dayjs/locale/ko";

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale("ko");

import Input from "../../../components/Input/Input";
import Button from "../../../components/Button/Button";
const AnswerList = ({
  item,
  img,
  userName,
  editingAnswerId,
  editedContent,
  setEditedContent,
  onEditComplete,
  newAnswerContent,
  setNewAnswerContent,
  onNewAnswer,
  isLoading = false,
}) => {
  const isEditing = editingAnswerId === item.answer?.id;

  // ✅ 수정: 렌더링 조건 명확히 분리
  const hasAnswer = !!item.answer;
  const isRejected = item.answer?.isRejected;
  const hasContent = !!item.answer?.content;

  // 답변이 없거나 content가 없는 경우 폼 표시
  const shouldShowAnswerForm = !hasAnswer || (hasAnswer && !hasContent);
  // 거절된 경우에만 거절 메시지 표시
  const shouldShowRejectedMessage = hasAnswer && isRejected === true;
  // 정상 답변이 있는 경우 답변 내용 표시
  const shouldShowAnswerContent = hasAnswer && hasContent && !isRejected;

  // 디버깅 로그
  console.log("🔍 AnswerList 렌더링 조건:", {
    questionId: item.id,
    hasAnswer,
    isRejected,
    hasContent,
    shouldShowAnswerForm,
    shouldShowRejectedMessage,
    shouldShowAnswerContent,
    answerContent: item.answer?.content,
  });

  return (
    <div className="questionContent">
      <img src={img} alt="작은 프로필" />
      <div>
        <p className="user">
          {userName}
          {item.answer && (item.answer.updatedAt || item.answer.createdAt) && (
            <span>
              {(() => {
                const timeString =
                  item.answer.updatedAt || item.answer.createdAt;
                // 서버 시간을 UTC로 파싱하고 로컬 시간으로 변환
                const parsedTime = dayjs.utc(timeString).local();
                return parsedTime.fromNow();
              })()}
            </span>
          )}
        </p>
        <div>
          {isEditing ? (
            // 수정 모드 - 기존 답변이 있는 경우
            <div>
              <Input
                type="textarea"
                variant="filled"
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                placeholder="답변을 입력해주세요"
                disabled={isLoading}
                style={{ height: "18.6rem" }}
                className="answerInput"
              />
              <Button
                size="medium"
                variant="primary"
                disabled={!editedContent.trim() || isLoading}
                onClick={() => onEditComplete(item.answer.id)}
                className="answerBtn"
              >
                {isLoading ? "수정 중..." : "수정완료"}
              </Button>
            </div>
          ) : (
            // 보기 모드 또는 새 답변 작성 모드
            <>
              {shouldShowRejectedMessage ? (
                // 거절된 답변인 경우 - "답변 거절됨" 텍스트만 표시
                <div className="qnaContent">
                  <p className="rejectedText">답변 거절됨</p>
                </div>
              ) : shouldShowAnswerContent ? (
                // 정상 답변이 있는 경우 - 답변 내용 표시
                <div className="qnaContent">
                  <div>{item.answer.content}</div>
                </div>
              ) : shouldShowAnswerForm ? (
                // 답변이 없거나 content가 없는 경우 - 답변 작성 폼
                <div>
                  <Input
                    type="textarea"
                    variant="filled"
                    value={newAnswerContent}
                    onChange={(e) => setNewAnswerContent(e.target.value)}
                    placeholder="답변을 입력해주세요"
                    disabled={isLoading}
                    style={{ height: "18.6rem" }}
                    className="answerInput"
                  />
                  <Button
                    size="medium"
                    variant="primary"
                    disabled={!newAnswerContent.trim() || isLoading}
                    onClick={() => onNewAnswer(item.id)}
                    className="answerBtn"
                  >
                    {isLoading ? "답변 중..." : "답변완료"}
                  </Button>
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnswerList;
