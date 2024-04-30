import {
  Button,
  Center,
  Image,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Flex,
} from "@chakra-ui/react";
import { axiosInstance } from "../../lib/axios";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useState } from "react";

export function TablePengaduanMasyarakat() {
  const toast = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pengaduanMasyarakatId,setPengaduanMasyarakatId] = useState(null);
  const [subjekPengaduanMasyarakat,setSubjekPengaduanMasyarakat] = useState(null);
  const [isiPengaduanMasyarakat,setIsiPengaduanMasyarakat] = useState(null);

  function formatDate(dateString) {
    const options = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  }

  let i = 1;
  const { data, refetch: refetchData } = useQuery({
    queryFn: async () => {
      const dataResponse = await axiosInstance.get("/pengaduanmasyarakat");
      return dataResponse;
    },
  });

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/pengaduanmasyarakat/delete/${id}`);

      toast({
        title: "Pengaduan Masyarakat has been deleted",
        status: "warning",
      });
      refetchData();
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };

  return (
    <TableContainer>
      <Table>
        <Thead>
          <Tr>
            <Th>No</Th>

            <Th>Warga</Th>
            <Th>Isi Aduan</Th>
            <Th>Tanggal</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {data?.data.values.map((data) => (
            <Tr key={data.pengaduan_masyarkat_id}>
              <Td>{i++}</Td>

              <Td>
                <Text as="b">{data.nama_lengkap}</Text>
                <Text>{data.nik}</Text>
              </Td>
              <Td maxW={40}>
                <Text as="b">{data.subjek}</Text>
                <Text noOfLines={1}>{data.isi}</Text>
              </Td>
              <Td>
                <Text as="b">{formatDate(data.tanggal)}</Text>
              </Td>
              <Td>
                <Center marginTop={1}>
                  <Button
                    colorScheme="grey"
                    variant="outline"
                    onClick={() => {
                      setIsModalOpen(true)
                      setPengaduanMasyarakatId(data.pengaduan_masyarkat_id)
                      setSubjekPengaduanMasyarakat(data.subjek)
                      setIsiPengaduanMasyarakat(data.isi)
                    }}
                  >
                    Detail
                  </Button>
                </Center>
                <Center marginTop={1}>
                  <Button
                    colorScheme="red"
                    onClick={() => handleDelete(data.pengaduan_masyarakat_id)}
                  >
                    Delete
                  </Button>
                </Center>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{subjekPengaduanMasyarakat}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex>
              <Center flex={1}>
                <Text>{isiPengaduanMasyarakat}</Text>
              </Center>
            </Flex>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </TableContainer>
  );
}