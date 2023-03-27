import {
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import useGetRoomData from "../../apiCalls/useGetRoomData";
import TriviaDBForm from "./TriviaDBForm";

type Props = {
  roomId?: string;
};

function NewGameForm({ roomId }: Props) {
  const { data: roomData } = useGetRoomData({ roomId });
  return (
    <Container>
      <Tabs variant="enclosed">
        <TabList>
          <Tab>Trivia DB</Tab>
          <Tab>Trivia Ninja</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <TriviaDBForm roomData={roomData} />
          </TabPanel>
          <TabPanel>
            <p>Coming Soon...</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
}

export default NewGameForm;
