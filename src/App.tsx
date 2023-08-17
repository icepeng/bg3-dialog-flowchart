import {
  Button,
  ChakraProvider,
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  cookieStorageManager,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { DialogDataProvider, useDialogData } from "./data/useDialogData";
import {
  TranslationDataProvider,
  useTranslationData,
} from "./data/useTranslationData";
import Workspace from "./flowchart/Workspace";
import theme from "./theme";

function PathSelector() {
  const { path, setPath } = useDialogData();
  const { apiToken, setApiToken } = useTranslationData();
  const [value, setValue] = useState(path);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [apiTokenValue, setApiTokenValue] = useState(apiToken);

  useEffect(() => {
    setValue(path);
  }, [path]);

  function handleSubmit() {
    setApiToken(apiTokenValue);
    onClose();
  }

  return (
    <Flex>
      <Input
        value={value}
        onChange={(e) => setValue(e.currentTarget.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            setPath(value);
          }
        }}
        placeholder="파일 경로"
      />
      <Button onClick={() => setPath(value)}>Load</Button>
      <Button onClick={onOpen}>API Token</Button>
      <Modal
        size={"2xl"}
        isOpen={isOpen}
        onClose={onClose}
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>API Token 입력</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              value={apiTokenValue}
              onChange={(e) => setApiTokenValue(e.currentTarget.value)}
              placeholder="API Token"
            />
          </ModalBody>
          <ModalFooter>
            <Button variant={"solid"} onClick={handleSubmit}>
              저장
            </Button>
            <Button variant={"outline"} onClick={onClose}>
              취소
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}

function App() {
  return (
    <ChakraProvider
      colorModeManager={cookieStorageManager}
      theme={theme}
      resetCSS
    >
      <DialogDataProvider>
        <TranslationDataProvider>
          <Flex direction={"column"} height={"100vh"} width={"100vw"}>
            <PathSelector />
            <Workspace />
          </Flex>
        </TranslationDataProvider>
      </DialogDataProvider>
    </ChakraProvider>
  );
}

export default App;
