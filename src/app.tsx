/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { recipientFetcherApi, recipientUpdaterApi } from "./api";
import { useRecipientUpdateController } from "./controller";
import { recipientFetcher, recipientUpdater } from "./gateway";
import { RecipientUpdateView } from "./view";

const fetchRecipient = recipientFetcher(recipientFetcherApi);
const updateRecipient = recipientUpdater(recipientUpdaterApi);

function App() {
  const controller = useRecipientUpdateController({
    recipientId: "1",
    fetcher: fetchRecipient,
    updater: updateRecipient,
  });

  useEffect(() => {
    controller.fetch();
  }, []);

  return (
    <RecipientUpdateView
      state={controller.state}
      onChange={controller.change}
      onSubmit={controller.update}
      onModalClose={controller.closeAlert}
    />
  );
}

export default App;
