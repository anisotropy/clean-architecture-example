/**
 * 프레젠터
 * - 화면에 표시할 내용에 대한 포맷을 정의한 단순한 객체이다.
 * - 엔티티와 유스케이스에만 의존한다.
 * - 순수함수로 구성되어 있어서 테스트하기 쉽다.
 * - 특정 프레임워크나 라이브러리에 의존하지 않는다.
 */

/**
 * 엔티티와 유스케이스에만 의존한다.
 */
import { recipientEntity } from "./entity";
import { recipientUpdateCase, type RecipientUpdateState } from "./useCase";

type FieldName = keyof RecipientUpdateState["values"];

type Field = {
  type: "text-field" | "radio";
  name: FieldName;
  label: string;
  value: string;
  error: string | null;
  disabled: boolean;
};

type Button = {
  type?: "submit" | "button";
  label: string;
  href?: "_back" | string;
  disabled?: boolean;
};

type Modal = {
  open: boolean;
  title: string;
  buttonLabel: string;
};

const fieldLabels: Record<FieldName, string> = {
  firstName: "이름",
  middleName: "중간 이름",
  lastName: "성",
  accountNumber: "계좌번호",
};

export type RecipientUpdatePresenter = {
  header: {
    title: string;
    name: string;
  };
  fields: Field[];
  buttons: Button[];
  modals: Modal[];
};

export const recipientUpdatePresenter = (
  state: RecipientUpdateState
): RecipientUpdatePresenter => ({
  header: {
    title: "수취인 수정",
    name: recipientEntity.deriveName(state.values),
  },
  fields: (
    ["firstName", "middleName", "lastName", "accountNumber"] as const
  ).map((name) => ({
    type: "text-field",
    name,
    label: fieldLabels[name],
    value: state.values[name] ?? "",
    error: state.errors[name] ?? "",
    disabled: state.phase === "fetching" || state.phase === "submitting",
  })),
  buttons: [
    {
      label: "취소",
      href: "_back",
      disabled: state.phase === "fetching" || state.phase === "submitting",
    },
    {
      type: "submit",
      label: "수정하기",
      disabled:
        !recipientUpdateCase.isSubmittable(state) ||
        state.phase === "fetching" ||
        state.phase === "submitting",
    },
  ],
  modals: [
    {
      open: state.alert === "fetch-error",
      title: "수취인 정보를 불러올 수 없습니다.",
      buttonLabel: "확인",
    },
    {
      open: state.alert === "submission-error",
      title: "수취인을 수정하지 못했습니다.",
      buttonLabel: "확인",
    },
    {
      open: state.alert === "submitted",
      title: "수취인 수정을 완료했습니다.",
      buttonLabel: "확인",
    },
  ],
});
