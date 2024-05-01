import {
  Box,
  Button,
  Center,
  FormControl,
  Image,
  Input,
  Spacer,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Tr,
  Textarea,
  useToast,
  Flex,
} from "@chakra-ui/react";
import { axiosInstance } from "../../lib/axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useRef } from "react";

export function FormWargaAdd() {
  const router = useRouter();

  const [loading] = useState(true);
  const [error] = useState(null);
  const nik = useRef();
  const kk = useRef();
  const nama_lengkap = useRef();
  const tanggal_lahir = useRef();

  const toast = useToast();

  const handleAdd = async () => {
    try {
      const formData = {
        nik: nik.current.value,
        kk: kk.current.value,
        nama_lengkap: nama_lengkap.current.value,
        tanggal_lahir: tanggal_lahir.current.value,
      };

      await axiosInstance.post(`/warga/add`, formData);

      toast({
        title: "Warga has been inserted",
        status: "success",
      });
      router.push(`/admin/warga`);
    } catch (error) {
      console.error("Error approving request:", error);
    }
  };

  return (
    <>
      <form>
        <Box p={8} borderWidth="1px" borderRadius="lg" overflow="hidden" mt={4}>
          <Flex>
            <Table flex={5}>
              <Tbody>
                <Tr>
                  <Th>NIK</Th>
                  <Td>
                    <FormControl>
                      <Input ref={nik} name="nik"></Input>
                    </FormControl>
                  </Td>
                </Tr>
                <Tr>
                  <Th>KK</Th>
                  <Td>
                    <FormControl>
                      <Input required ref={kk} name="kk"></Input>
                    </FormControl>
                  </Td>
                </Tr>
                <Tr>
                  <Th>Nama Lengkap</Th>
                  <Td>
                    <FormControl>
                      <Input
                        required
                        ref={nama_lengkap}
                        name="nama_lengkap"
                      ></Input>
                    </FormControl>
                  </Td>
                </Tr>
                <Tr>
                  <Th>Tanggal</Th>
                  <Td>
                    <FormControl>
                      <Input name="tanggal" type="date" ref={tanggal_lahir} />
                    </FormControl>
                  </Td>
                </Tr>
              </Tbody>
            </Table>

            <Spacer flex={1} />
          </Flex>

          <Center mt={4}>
            <Button
              variant="outline"
              bg="#4FD1C5"
              color="white"
              onClick={() => {
                handleAdd();
              }}
            >
              Add
            </Button>
          </Center>
        </Box>
      </form>
    </>
  );
}