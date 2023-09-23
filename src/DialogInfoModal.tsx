import {
    Badge,
    Button,
    Heading,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    useDisclosure
} from "@chakra-ui/react";
import { useGustav } from "./gustav/useGustav";

export default function DialogInfoModal() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { dialogData } = useGustav();

    if (!dialogData) return null;

    // get filename from path and remove extension
    const dialogTitle = dialogData.Path.split("/").pop()!.replace(/\.[^\.]*$/, "");
    const category = dialogData.Category;
    const synopsis = dialogData.Synopsis;

    return (<>
        <Button onClick={onOpen}>정보</Button>
        <Modal
            size={"2xl"}
            isOpen={isOpen}
            onClose={onClose}
            scrollBehavior="inside"
        >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>대화문 정보</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Heading>{dialogTitle}</Heading>
                    <Badge>{category}</Badge>
                    <Text>{synopsis}</Text>
                </ModalBody>
                <ModalFooter>
                    <Button variant={"outline"} onClick={onClose}>
                        닫기
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    </>)
}