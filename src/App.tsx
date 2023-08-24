import {
  Button,
  ChakraProvider,
  Flex,
  Input,
  Link,
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
import Workspace from "./flowchart/Workspace";
import { GustavProvider, useGustav } from "./gustav/useGustav";
import theme from "./theme";
import { WeblateProvider, useWeblate } from "./weblate/useWeblate";
import { ExternalLinkIcon } from "@chakra-ui/icons";

function PathSelector() {
  const { path, setPath } = useGustav();
  const { apiToken, setApiToken } = useWeblate();
  const [value, setValue] = useState(path);
  const { isOpen, onOpen, onClose } = useDisclosure({
    defaultIsOpen: !apiToken,
  });

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
      <Button onClick={onOpen}>Weblate 연동</Button>
      <Modal
        size={"2xl"}
        isOpen={isOpen}
        onClose={onClose}
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Weblate 연동</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Link href="https://waldo.team/accounts/profile/#api" isExternal>
              https://waldo.team/accounts/profile/#api{" "}
              <ExternalLinkIcon mx="2px" />
            </Link>{" "}
            에서 API Token을 복사할 수 있습니다.
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
      <GustavProvider>
        <WeblateProvider>
          <Flex
            direction={"column"}
            height={"100vh"}
            width={"100vw"}
            overflow="hidden"
          >
            <PathSelector />
            <Workspace />
          </Flex>
        </WeblateProvider>
      </GustavProvider>
    </ChakraProvider>
  );
}

export default App;
