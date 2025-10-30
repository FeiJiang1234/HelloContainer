import React, { useEffect, useState } from 'react';
import { useAuth, useDateTime, useElToast, useGamesType, useGoBack, useImagePicker, validator } from 'el/utils';
import { Flex } from 'native-base';
import {
    ElAgeRange,
    ElAvatar,
    ElBody,
    ElButton,
    ElDatePicker,
    ElErrorMessage,
    ElInput,
    ElKeyboardAvoidingView,
    ElSelectEx,
    ElTextarea,
    ElTitle,
} from 'el/components';
import { Formik } from 'formik';
import * as Yup from 'yup';
import {
    basketballGamesType,
    gameLength,
    GenderTypes,
    rank,
    SportType,
    SportTypes,
    timeZones,
} from 'el/enums';
import RegionCascader from 'el/components/RegionCascader';
import { playoffsType } from 'el/enums/playoffsType';
import { athleteService, leagueService } from 'el/api';
import { useDispatch } from 'react-redux';
import { ERROR, PENDING, SUCCESS } from 'el/store/slices/requestSlice';
import routes from 'el/navigation/routes';
import { statTrackingModule, statTrackingModules } from 'el/enums/statTrackingModule';

const validationStep1 = Yup.object().shape({
    name: Yup.string().required().max(100).label('Name'),
    sportType: Yup.string().required().label('SportType'),
    gender: Yup.string().required().label('Gender'),
    ...validator.ageRange,
    ...validator.dateRange,
    ...validator.address,
    timezone: Yup.string().required().label('Timezone'),
    gamesType: Yup.string().required().label('Games type'),
    gamesNumber: Yup.number().required().max(99).label('GamesNumber'),
    playoffsType: Yup.string().required().label('Playoffs type'),
    gameRules: Yup.string().required().label('Game Rules'),
    details: Yup.string().required().max(250).label('Details'),
    totalTeamAllowed: Yup.number().required().min(2).max(99).label('TotalTeamAllowed'),
    rosterAmount: Yup.number().required().label('RosterAmount'),
});

const validationStep2 = Yup.object().shape({
    contactNumber: Yup.number().required().label('ContactNumber'),
    contactEmail: Yup.string().required().email().label('ContactEmail'),
});

export default function LeagueCreateScreen({ navigation, route }) {
    useGoBack();
    const { chooseAvatarAsync, image, setImage, getImageFormData } = useImagePicker();
    const { imageUri, name, bio, associationId, fromAssociation } = route.params;
    const { sportGamesType, handlerSportTypeChanged } = useGamesType(basketballGamesType);
    const [hideCreateLeague, setHideCreateLeague] = useState(false);
    const dispatch = useDispatch();
    const { user } = useAuth()
    const { format } = useDateTime();
    const [associations, setAssociations] = useState([]);
    const toast = useElToast();

    const initValue: any = {
        name: name,
        associationId: associationId ?? "",
        sportType: '',
        gender: '',
        minAge: '',
        maxAge: '',
        timezone: '',
        startDate: new Date(),
        endDate: new Date(),
        country: '',
        state: '',
        city: '',
        gamesType: '',
        gameLength: '',
        gamesNumber: '',
        playoffsType: '',
        gameRules: '',
        details: bio,
        totalTeamAllowed: '',
        rosterAmount: '',
        contactNumber: '',
        contactEmail: '',
    };

    useEffect(() => { setImage({ uri: imageUri }); }, [imageUri]);

    useEffect(() => { getAthleteManagedAssociations(); }, [user]);

    const getAthleteManagedAssociations = async () => {
        const res: any = await athleteService.getAthleteManagedAssociations(user.id);
        if (res && res.code === 200) {
            const options = res.value.map(x => ({ label: `${x.code} (${x.name})`, value: x.code }));
            setAssociations(options);
        }
    };

    const handleCreateClick = async values => {
        if (!hideCreateLeague) setHideCreateLeague(true);
        values.startDate = format(values.startDate);
        values.endDate = format(values.endDate);

        if (hideCreateLeague) {
            dispatch(PENDING());
            const imageFile: any = getImageFormData();
            if (!imageFile) {
                toast.error("Image is required.");
            }

            const res: any = await leagueService.createLeague(values, imageFile);
            if (res && res.code === 200 && res.value) {
                dispatch(SUCCESS());
                navigation.navigate(routes.LeagueCreateSuccess, {
                    id: res.value,
                });
            } else {
                dispatch(ERROR());
            }
        }
    };

    const buildPageTitle = () => {
        if (!hideCreateLeague) return 'Create A League';
        return 'Unofficial League Details';
    };

    return (
        <ElKeyboardAvoidingView withOffset>
            <ElTitle>{buildPageTitle()}</ElTitle>
            <Formik
                initialValues={initValue}
                validationSchema={!hideCreateLeague ? validationStep1 : validationStep2}
                onSubmit={values => handleCreateClick(values)}>
                {({
                    handleChange,
                    handleSubmit,
                    errors,
                    setFieldTouched,
                    touched,
                    setFieldValue,
                    values,
                    isSubmitting
                }) => (
                    <>
                        <ElBody>Main information</ElBody>
                        <Flex align="center" my={2}>
                            <ElAvatar onPress={chooseAvatarAsync} size={81} uri={image.uri} />
                        </Flex>
                        <ElInput
                            defaultValue={initValue.name}
                            name="name"
                            placeholder="Name your League"
                            onBlur={() => setFieldTouched('name')}
                            onChangeText={handleChange('name')}
                            maxLength={100}
                        />
                        <ElErrorMessage error={errors['name']} visible={touched['name']} />

                        <ElSelectEx
                            defaultValue={initValue.associationId}
                            items={associations}
                            name="associationId"
                            onValueChange={value => { setFieldValue('associationId', value); }}
                            placeholder="Association Id (Optional)"
                            disabled={fromAssociation}
                        />

                        {!hideCreateLeague && (
                            <>
                                <ElBody>League Details</ElBody>
                                <ElSelectEx
                                    items={SportTypes}
                                    name="sportType"
                                    onValueChange={value => {
                                        const isSportChange = values.sportType !== value;
                                        if (isSportChange) {
                                            setFieldValue('gamesType', '');

                                            if(value !== SportType.Basketball && value !== SportType.Soccer){
                                                setFieldValue('trackModule', statTrackingModule.PostGameStats);
                                            }
                                        }
                                        setFieldValue('sportType', value);
                                        handlerSportTypeChanged(value);
                                    }}
                                    placeholder="Choose a sport"
                                />
                                <ElErrorMessage
                                    error={errors['sportType']}
                                    visible={touched['sportType']}
                                />

                                <ElSelectEx
                                    items={GenderTypes}
                                    name="gender"
                                    onValueChange={value => setFieldValue('gender', value)}
                                    placeholder="Gender"
                                />
                                <ElErrorMessage
                                    error={errors['gender']}
                                    visible={touched['gender']}
                                />

                                <ElAgeRange
                                    setFieldTouched={setFieldTouched}
                                    errors={errors}
                                    touched={touched}
                                    handleChange={handleChange}
                                />

                                <ElBody>Time/Date Details</ElBody>
                                <ElSelectEx
                                    items={timeZones}
                                    name="timezone"
                                    onValueChange={value => setFieldValue('timezone', value)}
                                    placeholder="Choose a Time zone"
                                />
                                <ElErrorMessage
                                    error={errors['timezone']}
                                    visible={touched['timezone']}
                                />

                                <ElDatePicker
                                    name="startDate"
                                    placeholder="Select start date"
                                    onSelectedDate={item => setFieldValue('startDate', item)}
                                    defaultValue={values.startDate}
                                />
                                <ElErrorMessage error={errors['startDate']} visible={true} />

                                <ElDatePicker
                                    name="endDate"
                                    placeholder="Select end date"
                                    onSelectedDate={item => setFieldValue('endDate', item)}
                                    defaultValue={values.endDate}
                                />
                                <ElErrorMessage error={errors['endDate']} visible={true} />

                                <RegionCascader
                                    setFieldValue={setFieldValue}
                                    touched={touched}
                                    errors={errors}
                                    values={values}
                                />
                                <ElBody>Game Details</ElBody>

                                <ElSelectEx
                                    items={rank}
                                    name="rank"
                                    onValueChange={value => setFieldValue('rank', value)}
                                    placeholder="Rank"
                                />
                                <ElErrorMessage error={errors['rank']} visible={touched['rank']} />

                                <ElSelectEx
                                    items={sportGamesType}
                                    name="gamesType"
                                    onValueChange={value => setFieldValue('gamesType', value)}
                                    placeholder="Games type"
                                />
                                <ElErrorMessage
                                    error={errors['gamesType']}
                                    visible={touched['gamesType']}
                                />
                                <ElSelectEx
                                    items={statTrackingModules}
                                    name="trackModule"
                                    onValueChange={value => setFieldValue('trackModule', value)}
                                    placeholder="Stat Tracking Module"
                                    disabled={values.sportType !== SportType.Basketball && values.sportType !== SportType.Soccer}
                                    value={values.trackModule}
                                />

                                {
                                    values.trackModule === statTrackingModule.LiveStatTracking &&
                                    <>
                                        <ElSelectEx
                                            items={gameLength}
                                            name="gameLength"
                                            onValueChange={value => setFieldValue('gameLength', value)}
                                            placeholder="Games length"
                                        />
                                        <ElErrorMessage
                                            error={errors['gameLength']}
                                            visible={touched['gameLength']}
                                        />
                                    </>
                                }
                                <ElInput
                                    name="gamesNumber"
                                    keyboardType="numeric"
                                    placeholder="Number of games in season"
                                    onBlur={() => setFieldTouched('gamesNumber')}
                                    onChangeText={handleChange('gamesNumber')}
                                    maxLength={5}
                                />
                                <ElErrorMessage
                                    error={errors['gamesNumber']}
                                    visible={touched['gamesNumber']}
                                />

                                <ElSelectEx
                                    items={playoffsType}
                                    name="playoffsType"
                                    onValueChange={value =>
                                        setFieldValue('playoffsType', value)
                                    }
                                    placeholder="Playoffs type"
                                />
                                <ElErrorMessage
                                    error={errors['playoffsType']}
                                    visible={touched['playoffsType']}
                                />

                                <ElTextarea
                                    name="gameRules"
                                    placeholder="Game Rules"
                                    onBlur={() => setFieldTouched('gameRules')}
                                    onChangeText={handleChange('gameRules')}
                                    maxLength={500}
                                />
                                <ElErrorMessage
                                    error={errors['gameRules']}
                                    visible={touched['gameRules']}
                                />

                                <ElTextarea
                                    name="details"
                                    placeholder="Details"
                                    onBlur={() => setFieldTouched('details')}
                                    onChangeText={handleChange('details')}
                                    defaultValue={initValue.details}
                                    maxLength={250}
                                />
                                <ElErrorMessage
                                    error={errors['details']}
                                    visible={touched['details']}
                                />

                                <ElBody>Team Details</ElBody>

                                <ElInput
                                    name="totalTeamAllowed"
                                    keyboardType="numeric"
                                    placeholder="Total Teams Allowed"
                                    onBlur={() => setFieldTouched('totalTeamAllowed')}
                                    onChangeText={handleChange('totalTeamAllowed')}
                                />
                                <ElErrorMessage
                                    error={errors['totalTeamAllowed']}
                                    visible={touched['totalTeamAllowed']}
                                />

                                <ElInput
                                    name="rosterAmount"
                                    keyboardType="numeric"
                                    placeholder="Roster Amount"
                                    onBlur={() => setFieldTouched('rosterAmount')}
                                    onChangeText={handleChange('rosterAmount')}
                                />
                                <ElErrorMessage
                                    error={errors['rosterAmount']}
                                    visible={touched['rosterAmount']}
                                />

                                <ElButton
                                    disabled={!image?.uri}
                                    onPress={handleSubmit}
                                    style={{ marginBottom: 8 }}>
                                    Next Step
                                </ElButton>
                            </>
                        )}

                        {hideCreateLeague && (
                            <>
                                <ElBody>Contact Details</ElBody>
                                <ElInput
                                    name="contactNumber"
                                    keyboardType="numeric"
                                    placeholder="League Contact Number"
                                    onBlur={() => setFieldTouched('contactNumber')}
                                    onChangeText={handleChange('contactNumber')}
                                    maxLength={11}
                                />
                                <ElErrorMessage
                                    error={errors['contactNumber']}
                                    visible={touched['contactNumber']}
                                />

                                <ElInput
                                    name="contactEmail"
                                    placeholder="League Contact Email"
                                    keyboardType="email-address"
                                    onBlur={() => setFieldTouched('contactEmail')}
                                    onChangeText={handleChange('contactEmail')}
                                    maxLength={100}
                                />
                                <ElErrorMessage
                                    error={errors['contactEmail']}
                                    visible={touched['contactEmail']}
                                />

                                <ElButton onPress={handleSubmit} style={{ marginBottom: 8 }} disabled={isSubmitting}>
                                    Create League
                                </ElButton>
                            </>
                        )}
                    </>
                )}
            </Formik>
        </ElKeyboardAvoidingView>
    );
}
