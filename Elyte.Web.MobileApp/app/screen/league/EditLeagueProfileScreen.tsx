import React, { useEffect, useState } from 'react';
import { athleteService, leagueService } from 'el/api';
import { useDispatch } from 'react-redux';
import { ERROR, PENDING, SUCCESS } from 'el/store/slices/requestSlice';
import { ResponseResult } from 'el/models/responseResult';
import {
    ElAgeRange,
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
import { basketballGamesType, gameLength, GenderTypes, rank, timeZones } from 'el/enums';
import RegionCascader from 'el/components/RegionCascader';
import { useAuth, useElToast, useGamesType, useGoBack, validator } from 'el/utils';
import routes from 'el/navigation/routes';
import * as Yup from 'yup';
import { LeagueModel } from 'el/models/league/leagueModel';

const validationSchema = Yup.object().shape({
    name: Yup.string().required().max(100).label('Name'),
    gender: Yup.string().required().label('Gender'),
    ...validator.ageRange,
    ...validator.dateRangeForEdit,
    ...validator.address,
    timezone: Yup.string().required().label('Timezone'),
    gamesType: Yup.string().required().label('Games type'),
    gamesNumber: Yup.number().required().max(5).label('GamesNumber'),
    gameRules: Yup.string().required().label('Game Rules'),
    details: Yup.string().required().max(250).label('Details'),
    totalTeamAllowed: Yup.number().required().min(2).max(99).label('TotalTeamAllowed'),
    rosterAmount: Yup.number().required().label('RosterAmount'),
    contactNumber: Yup.number().required().label('ContactNumber'),
    contactEmail: Yup.string().required().email().label('ContactEmail'),
});

export default function EditLeagueProfileScreen({ navigation, route }) {
    useGoBack();
    const { id } = route.params;
    const { sportGamesType, handlerSportTypeChanged } = useGamesType(basketballGamesType);
    const dispatch = useDispatch();
    const { user } = useAuth();
    const [profile, setProfile] = useState<LeagueModel>();
    const [associations, setAssociations] = useState([]);
    const toast = useElToast();

    const initValue = {
        name: profile?.name,
        associationId: profile?.associationId,
        gender: profile?.gender,
        minAge: profile?.minAge,
        maxAge: profile?.maxAge,
        timezone: profile?.timeZone,
        startDate: profile?.startDate,
        endDate: profile?.endDate,
        country: profile?.countryCode,
        countryName: profile?.country,
        state: profile?.stateCode,
        stateName: profile?.state,
        city: profile?.cityCode,
        cityName: profile?.city,
        rank: profile?.rank,
        gamesType: profile?.gameType,
        gameLength: profile?.gameLength,
        gamesNumber: profile?.gamesNumber,
        gameRules: profile?.gameRules,
        details: profile?.details,
        totalTeamAllowed: profile?.totalTeamsAllowed,
        rosterAmount: profile?.rosterAmount,
        contactNumber: profile?.phoneNumber,
        contactEmail: profile?.email,
    };

    useEffect(() => {
        getLeagueProfile();
    }, [id]);

    useEffect(() => {
        getAthleteManagedAssociations();
    }, [user]);

    
    useEffect(() => {
        if(!profile?.sportType) return;

        handlerSportTypeChanged(profile.sportType)
    }, [profile?.sportType]);

    const getLeagueProfile = async () => {
        dispatch(PENDING());
        const res: ResponseResult<LeagueModel> = await leagueService.getLeague(id);
        if (res && res.code === 200) {
            dispatch(SUCCESS());
            setProfile(res.value);
        } else {
            dispatch(ERROR());
        }
    };

    const getAthleteManagedAssociations = async () => {
        const res: any = await athleteService.getAthleteManagedAssociations(user.id);
        if (res && res.code === 200) {
            const options = res.value.map(x => ({ label: `${x.code} (${x.name})`, value: x.code }));
            setAssociations(options);
        }
    };

    const handleSaveClick = async values => {
        dispatch(PENDING());
        values.leagueId = id;
        const res: any = await leagueService.updateLeagueProfile(id, values);
        if (res && res.code === 200) {
            dispatch(SUCCESS());
            navigation.navigate({
                name: routes.LeagueProfile,
                params: { refresh: true },
                merge: true,
            });
        } else {
            toast.error(res.Message);
            dispatch(ERROR());
        }
    };

    return (
        <ElKeyboardAvoidingView withOffset>
            <ElTitle>Edit League Profile</ElTitle>
            {profile && (
                <Formik
                    initialValues={initValue}
                    validationSchema={validationSchema}
                    onSubmit={values => handleSaveClick(values)}>
                    {({
                        handleChange,
                        handleSubmit,
                        errors,
                        setFieldTouched,
                        touched,
                        setFieldValue,
                        values,
                        isSubmitting,
                    }) => (
                        <>
                            <ElBody>Main information</ElBody>
                            <ElInput
                                name="name"
                                placeholder="League Name"
                                onBlur={() => setFieldTouched('name')}
                                onChangeText={handleChange('name')}
                                maxLength={100}
                                defaultValue={values.name}
                            />
                            <ElErrorMessage error={errors['name']} visible={touched['name']} />

                            <ElBody>League Details</ElBody>
                            <ElSelectEx
                                items={GenderTypes}
                                name="gender"
                                onValueChange={value => setFieldValue('gender', value)}
                                placeholder="Gender"
                                defaultValue={values.gender}
                            />
                            <ElErrorMessage error={errors['gender']} visible={touched['gender']} />

                            <ElAgeRange
                                setFieldTouched={setFieldTouched}
                                errors={errors}
                                touched={touched}
                                handleChange={handleChange}
                                defaultValues={values}
                            />

                            <ElSelectEx
                                defaultValue={values.associationId}
                                items={associations}
                                name="associationId"
                                onValueChange={value => {
                                    setFieldValue('associationId', value);
                                }}
                                placeholder="Association Id (Optional)"
                            />

                            <ElBody>Time/Date Details</ElBody>

                            <ElSelectEx
                                items={timeZones}
                                name="timezone"
                                onValueChange={value => setFieldValue('timezone', value)}
                                placeholder="Choose a Time zone"
                                defaultValue={values.timezone}
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
                                defaultValue={values.rank}
                            />
                            <ElErrorMessage error={errors['rank']} visible={touched['rank']} />

                            <ElSelectEx
                                items={sportGamesType}
                                name="gamesType"
                                onValueChange={value => setFieldValue('gamesType', value)}
                                placeholder="Games type"
                                defaultValue={values.gamesType}
                            />
                            <ElErrorMessage
                                error={errors['gamesType']}
                                visible={touched['gamesType']}
                            />
                            {
                                !profile.isLowStats && 
                                <>
                                    <ElSelectEx
                                        items={gameLength}
                                        name="gameLength"
                                        onValueChange={value => setFieldValue('gameLength', value)}
                                        placeholder="Games length"
                                        defaultValue={values.gameLength}
                                    />
                                    <ElErrorMessage
                                        error={errors['gameLength']}
                                        visible={touched['gameLength']}
                                    />
                                </>

                            }
                            <ElTextarea
                                name="gameRules"
                                placeholder="Game Rules"
                                onBlur={() => setFieldTouched('gameRules')}
                                onChangeText={handleChange('gameRules')}
                                defaultValue={values.gameRules}
                                maxLength={500}
                            />
                            <ElErrorMessage
                                error={errors['gameRules']}
                                visible={touched['gameRules']}
                            />

                            <ElInput
                                name="gamesNumber"
                                keyboardType="numeric"
                                placeholder="Number of games in season"
                                onBlur={() => setFieldTouched('gamesNumber')}
                                onChangeText={handleChange('gamesNumber')}
                                defaultValue={values.gamesNumber?.toString()}
                                maxLength={5}
                            />
                            <ElErrorMessage
                                error={errors['gamesNumber']}
                                visible={touched['gamesNumber']}
                            />

                            <ElTextarea
                                name="details"
                                placeholder="Details"
                                onBlur={() => setFieldTouched('details')}
                                onChangeText={handleChange('details')}
                                defaultValue={values.details}
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
                                defaultValue={values.totalTeamAllowed?.toString()}
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
                                defaultValue={values.rosterAmount?.toString()}
                            />
                            <ElErrorMessage
                                error={errors['rosterAmount']}
                                visible={touched['rosterAmount']}
                            />

                            <ElBody>Contact Details</ElBody>
                            <ElInput
                                name="contactNumber"
                                keyboardType="numeric"
                                placeholder="League Contact Number"
                                onBlur={() => setFieldTouched('contactNumber')}
                                onChangeText={handleChange('contactNumber')}
                                defaultValue={values.contactNumber}
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
                                defaultValue={values.contactEmail}
                            />
                            <ElErrorMessage
                                error={errors['contactEmail']}
                                visible={touched['contactEmail']}
                            />

                            <ElButton
                                onPress={handleSubmit}
                                style={{ marginBottom: 8 }}
                                disabled={isSubmitting}>
                                Save
                            </ElButton>
                        </>
                    )}
                </Formik>
            )}
        </ElKeyboardAvoidingView>
    );
}
