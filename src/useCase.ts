/**
 * 유스 케이스
 * - 자동화된 시스템이 사용되는 방법. 사용자가 제공해야 하는 입력, 사용자에게 보여줄 출력, 그리고 해당 출력을 생성하기 위한 처리 단계를 기술한다
 * - 엔티티에만 의존한다.
 * - 순수함수로 구성되어 있어서 테스트하기 쉽다.
 * - 특정 프레임워크나 라이브러리에 의존하지 않는다.
 */

/**
 * 엔티티에만 의존한다.
 */
import { type RecipientEntity } from "./entity";

type Field = Exclude<keyof RecipientEntity, "id">;

type Phase = "init" | "fetching" | "fetched" | "submitting" | "submitted";

type Errors = Partial<Record<Field, string>>;

type State = {
  phase: Phase;
  values: Pick<RecipientEntity, Field>;
  errors: Errors;
  alert: null | "fetch-error" | "submission-error" | "submitted";
};

type StateSetter = <Which extends keyof State>(
  which: Which,
  value: Partial<State[Which]>
) => void;

type Fetcher = (params: {
  recipientId: string;
  onSuccess: (recipient: RecipientEntity) => void;
  onError: () => void;
}) => void;

type Updater = (params: {
  recipient: RecipientEntity;
  onSuccess: () => void;
  onError: () => void;
}) => void;

export const initRecipientUpdateState: State = {
  phase: "init",
  values: {
    firstName: "",
    lastName: "",
    accountNumber: "",
  },
  errors: {},
  alert: null,
};

const validators: Record<Field, (value: string) => string> = {
  firstName: (value: string) => (value ? "" : "필수 입력 사항입니다."),
  lastName: (value: string) => (value ? "" : "필수 입력 사항입니다."),
  middleName: () => "",
  accountNumber: (value: string) => {
    if (!/^\d+$/.test(value)) return "계좌번호는 숫자만 입력해주세요.";
    if (value.length !== 10) return "계좌번호는 10자리여야 합니다.";
    return "";
  },
};

/**
 * 수취인 정보를 가져온다.
 * 가져온 수취인 정보에 대해 유효성 검사를 실행해, 에러 메시지를 표시한다.
 * 수취인을 가져올 때, 에러가 발생하면 alert를 표시한다.
 */
const fetch =
  (params: {
    stateSetter: StateSetter;
    fetcher: Fetcher;
    recipientId: string;
  }) =>
  () => {
    params.stateSetter("phase", "fetching");
    params.fetcher({
      recipientId: params.recipientId,
      onSuccess: (recipient) => {
        params.stateSetter("values", recipient);
        params.stateSetter("phase", "fetched");
        Object.entries(validators).forEach(([field, validate]) => {
          params.stateSetter("errors", {
            [field]: validate(recipient[field as Field] ?? ""),
          });
        });
      },
      onError: () => {
        params.stateSetter("phase", "init");
        params.stateSetter("alert", "fetch-error");
      },
    });
  };

/**
 * 수취인 정보에 대한 사용자 입력을 반영한다.
 * 이때, 유효성 검사를 수행하여 에러 메시지를 표시한다.
 */
const change = (stateSetter: StateSetter) => (field: Field, value: string) => {
  stateSetter("values", { [field]: value });
  stateSetter("errors", { [field]: validators[field](value) });
};

/**
 * 수취인 정보를 갱신할 수 있는지 여부를 판단한다.
 */
const isSubmittable = (state: State) =>
  Object.values(state.errors).every((error) => !error);

/**
 * 수취인 정보를 갱신한다.
 * 수취인을 갱신할 때, 에러가 발생하면 alert를 표시한다.
 */
const update =
  (params: {
    stateSetter: StateSetter;
    updater: Updater;
    recipientId: string;
    values: State["values"];
  }) =>
  () => {
    params.stateSetter("phase", "submitting");
    params.updater({
      recipient: {
        id: params.recipientId,
        ...params.values,
      },
      onSuccess: () => {
        params.stateSetter("phase", "submitted");
        params.stateSetter("alert", "submitted");
      },
      onError: () => {
        params.stateSetter("phase", "fetched");
        params.stateSetter("alert", "submission-error");
      },
    });
  };

/**
 * alert 를 닫는다.
 */
const closeAlert = (stateSetter: StateSetter) => () => {
  stateSetter("alert", null);
};

export type RecipientUpdateState = State;
export type RecipientUpdateStateSetter = StateSetter;
export type RecipientUpdateFetcher = Fetcher;
export type RecipientUpdateUpdater = Updater;
export const recipientUpdateCase = {
  fetch,
  change,
  isSubmittable,
  update,
  closeAlert,
};
