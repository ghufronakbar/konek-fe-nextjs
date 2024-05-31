import {
  Box,
  Button,
  Center,
  Table,
  Flex,
  Text,
  useToast,
  Spacer,
  Tbody,
  Tr,
  TableContainer,
  Th,
  Td,
  Image,
  HStack,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Textarea,
} from "@chakra-ui/react";
import { axiosInstance } from "../../lib/axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { WarningIcon } from "@chakra-ui/icons";
import { Loading } from "../Loading";

export function DetailPemilihanKepalaDesaID({ gap }) {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const toast = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [judul, setJudul] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [tanggalMulai, setTanggalMulai] = useState("");
  const [tanggalSelesai, setTanggalSelesai] = useState("");
  const [editedPemilihanKetuaId, setEditedPemilihanKetuaId] = useState(null);

  const { data, refetch: refetchData } = useQuery({
    queryKey: [`pemilihankepaladesa/detail/${id}`],
    queryFn: async () => {
      const dataResponse = await axiosInstance.get(
        `/pemilihankepaladesa/detail/${id}`
      );
      setLoading(false)
      return dataResponse;
    },
  });

  function formatDate(dateString) {
    const options = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  }

  const formatDate2 = (isoDateString) => {
    const date = new Date(isoDateString);
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    if (month < 10) month = "0" + month;
    let day = date.getDate();
    if (day < 10) day = "0" + day;
    return `${year}-${month}-${day}`;
  };

  const handleDeleteCalonKetua = async (id) => {
    try {
      const response = await axiosInstance.delete(`/calonketua/delete/${id}`);

      toast({
        title: response.data.message,
        status: "warning",
      });
      refetchData();
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };

  const handleEditPemilihanKetua = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.put(
        `/pemilihankepaladesa/edit/${editedPemilihanKetuaId}`,
        {
          judul: judul,
          deskripsi: deskripsi,
          tanggal_mulai: tanggalMulai,
          tanggal_selesai: tanggalSelesai,
        }
      );
      toast({
        title: response.data.message,
        status: "success",
      });
      refetchData();
      setIsModalOpen(false);
    } catch (error) {
      toast({
        title: error.response.data.message,
        status: "error",
      });
      console.error("Error rejecting request:", error);
    }
  };

    if (loading) return <Loading/>
  // if (error) return <div>Error fetching data: {error.message}</div>;

  return (
    <>
      <Flex direction="column" w="100%" m={gap}>
        <Box>
          {data?.data.values.map((item) => (
            <Flex mt={8}>
              <Box flex={7} mt={4}>
                <Box
                  p={8}
                  borderWidth="1px"
                  borderRadius="lg"
                  overflow="hidden"
                >
                  <Box mt={4}>
                    <TableContainer>
                      <Table>
                        <Tbody>
                          <Tr>
                            <Th>Judul</Th>
                            <Td>{item.judul}</Td>
                          </Tr>
                          <Tr>
                            <Th>Deskripsi</Th>
                            <Td>
                              <Box maxW={20}>
                                <Text>{item.deskripsi}</Text>
                              </Box>
                            </Td>
                          </Tr>
                          <Tr>
                            <Th>Status</Th>
                            <Td>
                              <Center>
                                {item.status == 1 && (
                                  <Box
                                    as="button"
                                    borderRadius="md"
                                    bg="#CBD5E0"
                                    color="white"
                                    px={4}
                                    h={8}
                                  >
                                    Not Started
                                  </Box>
                                )}
                                {item.status == 2 && (
                                  <Box
                                    as="button"
                                    borderRadius="md"
                                    bg="#0063d1"
                                    color="white"
                                    px={4}
                                    h={8}
                                  >
                                    Ongoing
                                  </Box>
                                )}
                                {item.status == 3 && (
                                  <Box
                                    as="button"
                                    borderRadius="md"
                                    bg="#48BB78"
                                    color="white"
                                    px={4}
                                    h={8}
                                  >
                                    Finished
                                  </Box>
                                )}
                              </Center>
                            </Td>
                          </Tr>
                          <Tr>
                            <Th>Tanggal Mulai</Th>
                            <Td>{formatDate(item.tanggal_mulai)}</Td>
                          </Tr>
                          <Tr>
                            <Th>Tanggal Selesai</Th>
                            <Td>{formatDate(item.tanggal_selesai)}</Td>
                          </Tr>

                          <Tr>
                            <Th>Calon Ketua</Th>
                            <Td>{item.calon_ketua.length}</Td>
                          </Tr>
                        </Tbody>
                      </Table>
                    </TableContainer>
                    <Center>
                      {item.status == 1 ? (
                        <Button
                          mt={4}
                          variant="outline"
                          bg="#4FD1C5"
                          color="white"
                          onClick={() => {
                            setIsModalOpen(true);
                            setEditedPemilihanKetuaId(item.pemilihan_ketua_id);
                            setJudul(item.judul);
                            setDeskripsi(item.deskripsi);
                            setTanggalMulai(item.tanggal_mulai);
                            setTanggalSelesai(item.tanggal_selesai);
                          }}
                        >
                          Edit
                        </Button>
                      ) : (
                        ""
                      )}
                    </Center>
                  </Box>
                </Box>
              </Box>
              <Spacer />
              <Box flex={7} mt={4}>
                <Box
                  p={8}
                  borderWidth="1px"
                  borderRadius="lg"
                  overflow="hidden"
                >
                  <Flex>
                    <Spacer flex={4} />
                    {item.status == 1 ? (
                      <Box
                        as="button"
                        borderRadius="md"
                        bg="#48BB78"
                        color="white"
                        px={4}
                        h={8}
                        marginRight={4}
                        onClick={() => {
                          router.push(
                            `/admin/pemilihankepaladesa/calon/add/${item.pemilihan_ketua_id}`
                          );
                        }}
                      >
                        Add Calon Ketua
                      </Box>
                    ) : (
                      ""
                    )}
                  </Flex>
                  {item.calon_ketua.length == 0 ? (
                    <Box
                      p={8}
                      m={4}
                      borderWidth="1px"
                      borderRadius="lg"
                      overflow="hidden"
                    >
                      <Text>
                        <WarningIcon marginLeft={6} marginRight={6} /> Calon
                        Ketua Belum Tersedia
                      </Text>
                    </Box>
                  ) : (
                    ""
                  )}

                  {item.calon_ketua.map((calon) => (
                    <>
                      <Box
                        p={8}
                        m={4}
                        borderWidth="1px"
                        borderRadius="lg"
                        overflow="hidden"
                      >
                        <Center>
                          <Image
                            borderRadius="18"
                            boxSize="120px"
                            objectFit="cover"
                            src={calon.foto}
                            alt={calon.foto}
                          />
                        </Center>
                        <TableContainer>
                          <Table>
                            <Tbody>
                              <Tr>
                                <Th>{calon.namalengkap}</Th>
                                <Td isNumeric>{calon.nik}</Td>
                              </Tr>

                              <Tr>
                                <Th>Deskripsi </Th>
                              </Tr>
                              <Tr>
                                <Td maxW={20}>{calon.deskripsi_calon}</Td>
                              </Tr>

                              <Tr>
                                <Th>Total Pemilih: </Th>
                                <Td isNumeric>{calon.total_pemilih}</Td>
                              </Tr>
                              <Tr></Tr>
                            </Tbody>
                          </Table>
                        </TableContainer>
                        <Center mt={4}>
                          <HStack>
                            <Box
                              as="button"
                              borderRadius="md"
                              bg="#E53E3E"
                              color="white"
                              px={4}
                              h={8}
                              onClick={() => {
                                handleDeleteCalonKetua(calon.calon_ketua_id);
                              }}
                            >
                              Delete
                            </Box>

                            <Box
                              as="button"
                              borderRadius="md"
                              bg="#0063d1"
                              color="white"
                              px={4}
                              h={8}
                              onClick={() => {
                                router.push(
                                  `/admin/pemilihankepaladesa/calon/${calon.calon_ketua_id}`
                                );
                              }}
                            >
                              Edit
                            </Box>
                          </HStack>
                        </Center>
                      </Box>
                    </>
                  ))}
                </Box>
              </Box>
            </Flex>
          ))}
          <Modal
            size="xl"
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Edit Pemilihan Ketua</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <form onSubmit={handleEditPemilihanKetua}>
                  <FormControl m={2}>
                    <Input
                      name="judul"
                      value={judul}
                      onChange={(e) => setJudul(e.target.value)}
                    />
                  </FormControl>
                  <FormControl m={2}>
                    <Textarea
                      name="deskripsi"
                      value={deskripsi}
                      onChange={(e) => setDeskripsi(e.target.value)}
                    />
                  </FormControl>
                  <FormControl m={2}>
                    <Input
                      type="date"
                      name="tanggal_mulai"
                      value={formatDate2(tanggalMulai)}
                      onChange={(e) => setTanggalMulai(e.target.value)}
                    />
                  </FormControl>
                  <FormControl m={2}>
                    <Input
                      type="date"
                      name="tanggal_selesai"
                      value={formatDate2(tanggalSelesai)}
                      onChange={(e) => setTanggalSelesai(e.target.value)}
                    />
                  </FormControl>
                  <Center>
                    <Button
                      mt={8}
                      borderRadius="md"
                      bg="#48BB78"
                      color="white"
                      px={4}
                      h={8}
                      type="submit"
                    >
                      Update
                    </Button>
                  </Center>
                </form>
              </ModalBody>
              <ModalFooter></ModalFooter>
            </ModalContent>
          </Modal>
        </Box>
      </Flex>
    </>
  );
}
