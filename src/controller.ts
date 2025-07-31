/**
 * 컨트롤러
 * - 유스케이스를 특정 라이브러리(리액트)를 이용해서 구현한 함수이다.
 * - 유스케이스에 대한 '험블 함수'이다.
 * - 비순수함수이기 때문에 테스트하기 어렵다.
 * - 엔티티와 유스케이스에 의존한다.
 */

import { useState } from "react";
/**
 * 유스케이스에 의존적이다.
 */
import {
  initRecipientUpdateState,
  recipientUpdateCase,
  type RecipientUpdateFetcher,
  type RecipientUpdateState,
  type RecipientUpdateUpdater,
} from "./useCase";

export const useRecipientUpdateController = (params: {
  recipientId: string;
  fetcher: RecipientUpdateFetcher;
  updater: RecipientUpdateUpdater;
}) => {
  const [state, setState] = useState<RecipientUpdateState>(
    initRecipientUpdateState
  );
  const stateSetter = <Which extends keyof RecipientUpdateState>(
    which: Which,
    value: Partial<RecipientUpdateState[Which]>
  ) => {
    setState((prev) => ({
      ...prev,
      [which]: (() => {
        if (which === "values") return { ...prev.values, ...value };
        if (which === "errors") return { ...prev.errors, ...value };
        return value;
      })(),
    }));
  };

  const fetch = recipientUpdateCase.fetch({
    stateSetter,
    fetcher: params.fetcher,
    recipientId: params.recipientId,
  });

  const change = recipientUpdateCase.change(stateSetter);

  const update = recipientUpdateCase.update({
    stateSetter,
    updater: params.updater,
    recipientId: params.recipientId,
    values: state.values,
  });

  const closeAlert = recipientUpdateCase.closeAlert(stateSetter);

  return {
    state,
    change,
    fetch,
    update,
    closeAlert,
  };
};
