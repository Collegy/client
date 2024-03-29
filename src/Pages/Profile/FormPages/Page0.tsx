import { useContext, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import {
  Button,
  Flex,
  FormControl,
  Grid,
  Heading,
  Input,
  InputGroup,
  InputLeftAddon,
  Skeleton,
  useToast,
} from "@chakra-ui/react";
import { Profile } from "../Profile";
import { LoadingContext } from "../Profile";
import { UserCollegeData } from "../../../types";
import axios from "axios";
import { getCookie } from "../../../Fetch";

export function Page0() {
  const { context: FormDataContext } = Profile();
  const [fD] = useContext(FormDataContext);
  const [formData, setFormData] = useState<UserCollegeData>();
  const [isLoading, setIsLoading] = useContext(LoadingContext);

  const toast = useToast();

  useEffect(() => {
    if (
      fD === undefined ||
      formData === undefined ||
      fD.academic.gpa === -1 ||
      formData.academic.gpa === -1
    ) {
      setFormData(fD);
    }
  }, [fD, formData]);

  const SRef = useRef<HTMLInputElement>(null);
  const TRef = useRef<HTMLInputElement>(null);
  const RRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();

  const formValid = true;
  dispatch({ type: "SET_FORM_VALID", formValid });

  function checkValid() {
    if (!SRef.current?.value || Number(SRef.current?.value) <= 0) {
      return false;
    }
    if (!TRef.current?.value || Number(TRef.current?.value) <= 0) {
      return false;
    }
    if (!RRef.current?.value || Number(RRef.current?.value) <= 0) {
      return false;
    }
    const formValid = true;
    dispatch({ type: "SET_FORM_VALID", formValid });
    return true;
  }

  function handleChange(event: any) {
    const { name, value } = event.target;
    const [parent, child] = name.split(".");
    setFormData((prevFormData: any) => ({
      ...prevFormData,
      [parent]: {
        ...prevFormData[parent],
        [child]: value,
      },
    }));
    checkValid();
  }

  const HandleSave = (event: any) => {
    setIsLoading(true);
    checkValid();
    if (formValid) {
      event.preventDefault();
      axios
        .post(
          "https://collegy-server.herokuapp.com/user/submit-questionaire/" +
            getCookie("visitorId="),
          formData
        )
        .then((res: any) => {
          axios
            .get(
              "https://collegy-server.herokuapp.com/user/set-college-list/" +
                getCookie("visitorId=")
            )
            .then(() => {
              setIsLoading(false);
              toast({
                title: "Saved!",
                description: "Your college list has been updated.",
                status: "success",
                duration: 3000,
                isClosable: true,
              });
            });
        })
        .catch((err: any) => {
          console.error(err);
          setIsLoading(false);
          toast({
            title: "Oops...",
            description: "Something went wrong saving.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        });
    }
  };

  return formData && formData.academic.gpa !== -1 ? (
    <>
      <Heading as="h4" size="md">
        Preferred List Length
      </Heading>
      <Grid
        templateColumns={{ base: "repeat(1, 3fr)", md: "repeat(3, 1fr)" }}
        gap={1}
      >
        <FormControl>
          <InputGroup>
            <InputLeftAddon children="# Safeties" />
            <Input
              onChange={handleChange}
              name={"listLengths.safeties"}
              type="number"
              defaultValue={String(formData.listLengths.safeties)}
              required
              min={1}
              ref={SRef}
            />
          </InputGroup>
        </FormControl>
        <InputGroup>
          <InputLeftAddon children="# Targets" />
          <Input
            onChange={handleChange}
            name={"listLengths.targets"}
            type="number"
            defaultValue={String(formData.listLengths.targets)}
            required
            min={1}
            ref={TRef}
          />
        </InputGroup>
        <InputGroup>
          <InputLeftAddon children="# Reaches" />
          <Input
            onChange={handleChange}
            name={"listLengths.reaches"}
            type="number"
            defaultValue={String(formData.listLengths.reaches)}
            required
            min={1}
            ref={RRef}
          />
        </InputGroup>
      </Grid>
      <Flex mt={5} justifyContent={"right"}>
        <Button
          variant={"secondary"}
          onClick={HandleSave}
          size="sm"
          isLoading={isLoading}
        >
          Save*
        </Button>
      </Flex>
    </>
  ) : (
    <Skeleton>LOADING</Skeleton>
  );
}
