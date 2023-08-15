import {
  Button,
  Checkbox,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { useNodeData } from "./flowchart/useNodeData";

function Config() {
  const {
    rootId,
    setRootId,
    rootNodes,
    flags,
    flagState,
    setAllFlags,
    setFlag,
  } = useNodeData();

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <HStack>
      <Select value={rootId} onChange={(e) => setRootId(e.target.value)}>
        <option value={""}>Select a root node</option>
        {rootNodes.map((node) => (
          <option key={node.UUID} value={node.UUID}>
            {node.EditorData.logicalname}
          </option>
        ))}
      </Select>
      <Button onClick={onOpen}>Configure Flags</Button>
      <Modal
        size={"2xl"}
        isOpen={isOpen}
        onClose={onClose}
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Flag Settings</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack align="start">
              <div>
                <Button onClick={() => setAllFlags(true)}>Select All</Button>
                <Button onClick={() => setAllFlags(false)}>Deselect All</Button>
              </div>
              {flags.map((flag) => (
                <Checkbox
                  key={flag.UUID}
                  isChecked={flagState[flag.UUID]}
                  onChange={(e) => setFlag(flag.UUID, e.currentTarget.checked)}
                >
                  {flag.Name}
                </Checkbox>
              ))}
            </VStack>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </HStack>
  );
}

export default Config;
