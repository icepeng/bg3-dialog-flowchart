import {
  Button,
  Checkbox,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Stack,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import { useConfig } from "./useConfig";
import { useNodeData } from "./useNodeData";
import { useReactFlow } from "reactflow";

function Config() {
  const { rootNodes, flags } = useNodeData();
  const { rootId, setRootId, setFlag, setAllFlags, flagRecord } = useConfig();
  const { fitView } = useReactFlow();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [nodeSearchId, setNodeSearchId] = useState<string>("");

  function searchNode() {
    console.log(nodeSearchId);
    console.log(rootNodes);
    setTimeout(() => fitView({ nodes: [{ id: nodeSearchId }] }), 0);
  }

  return (
    <Stack direction="column" gap={0}>
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
                  <Button onClick={() => setAllFlags(false)}>
                    Deselect All
                  </Button>
                </div>
                {flags.map((flag) => (
                  <Checkbox
                    key={flag.UUID}
                    isChecked={flagRecord[flag.UUID]}
                    onChange={(e) =>
                      setFlag(flag.UUID, e.currentTarget.checked)
                    }
                  >
                    {flag.Name}
                  </Checkbox>
                ))}
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button onClick={onClose}>Close</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </HStack>
      <HStack>
        <Input
          value={nodeSearchId}
          onChange={(e) => setNodeSearchId(e.currentTarget.value)}
          placeholder="Node ID"
        />
        <Button onClick={searchNode}>Find</Button>
      </HStack>
    </Stack>
  );
}

export default Config;
