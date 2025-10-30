import React, { useEffect, useState } from "react";
import { ElButton, ElIdiograph, ElScrollContainer, ElSelect, ElTitle } from "el/components";
import { EventProfileModel } from "el/models/event/eventProfileModel";
import { ResponseResult } from "el/models/responseResult";
import { ERROR, PENDING, SUCCESS } from "el/store/slices/requestSlice";
import { VStack, Image, Text, Box } from "native-base";
import { eventService } from "el/api";
import { useAuth, useDateTime, useElToast, useGoBack } from "el/utils";
import { useDispatch } from "react-redux";
import { EventShareType } from "../../enums"
import { Formik } from "formik";
import routes from "el/navigation/routes";

export default function EventShareScreen({ navigation, route }) {
    useGoBack();

    const { id } = route.params;
    const dispatch = useDispatch();
    const { fromNow } = useDateTime();
    const { user } = useAuth();
    const [profile, setProfile] = useState<EventProfileModel>();
    const toast = useElToast();

    useEffect(() => {
        getEventProfile();
    }, [id])

    const getEventProfile = async () => {
        dispatch(PENDING());
        const res: ResponseResult<EventProfileModel> = await eventService.getEventProfile(id);
        if (res && res.code === 200) {
            dispatch(SUCCESS());
            setProfile(res.value);
        } else {
            dispatch(ERROR());
        }
    }

    const handleShareEvent = async (data) => {
        dispatch(PENDING());
        const res: any = await eventService.shareEvent(id, data.shareType);
        if (res && res.code === 200) {
            dispatch(SUCCESS());
            toast.success("Share successfully!");
            navigation.navigate(routes.PostList, { refresh: true });
        } else {
            dispatch(ERROR());
        }
    };

    return <ElScrollContainer>
        <ElTitle>Share an Event</ElTitle>
        <VStack borderColor="coolGray.200" borderWidth="1" >
            <Box padding={2}>
                <ElIdiograph
                    title={`${user.firstName} ${user.lastName}`}
                    imageUrl={user.pictureUrl}
                    subtitle={fromNow(profile?.createdDate)}
                    imageSize={48}
                />
            </Box>
            {profile && profile?.imageUrl && <Image style={{ height: 300 }} source={{ uri: profile?.imageUrl }} alt="image"></Image>}
            <Box padding={2}>
                <Text>{profile?.details}</Text>
            </Box>
            <Formik
                initialValues={{ shareType: "Followers" }}
                onSubmit={values => handleShareEvent(values)}>
                {({ values, handleSubmit, setFieldValue,isSubmitting }) => (
                    <>
                        < ElSelect
                            name="shareType"
                            items={EventShareType}
                            onSelectedItem={e => { setFieldValue("shareType", e?.value); }}
                            defaultValue={values.shareType}
                            placeholder="Share To"
                        />
                        <ElButton onPress={handleSubmit} disabled={isSubmitting}>Share an event</ElButton>
                    </>
                )}
            </Formik>
        </VStack>
    </ElScrollContainer >
}