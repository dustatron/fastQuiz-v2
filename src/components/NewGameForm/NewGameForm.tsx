import {
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import useGetRoomData from "../../apiCalls/useGetRoomData";
import TheTriviaApi from "./TheTriviaApi";
import TriviaDBForm from "./TriviaDBForm";

type Props = {
  roomId?: string;
};

function NewGameForm({ roomId }: Props) {
  const { data: roomData } = useGetRoomData({ roomId });
  return (
    <Container paddingTop="3">
      <Tabs variant="enclosed">
        <TabList>
          <Tab>Open Trivia DB</Tab>
          <Tab>The Trivia Api</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <TriviaDBForm roomData={roomData} />
          </TabPanel>
          <TabPanel>
            <TheTriviaApi />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
}

export default NewGameForm;
