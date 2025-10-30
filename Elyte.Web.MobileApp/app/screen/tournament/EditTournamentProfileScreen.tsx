import { athleteService, tournamentService } from "el/api";
import { ElAgeRange, ElBody, ElButton, ElDatePicker, ElErrorMessage, ElInput, ElKeyboardAvoidingView, ElSelectEx, ElTextarea, ElTitle } from "el/components";
import RegionCascader from "el/components/RegionCascader";
import { basketballGamesType, gameLength, GenderTypes, rank, SportTypes, timeZones } from "el/enums";
import { ResponseResult } from "el/models/responseResult";
import { TournamentModel } from "el/models/tournament/tournamentModel";
import routes from "el/navigation/routes";
import { ERROR, PENDING, SUCCESS } from "el/store/slices/requestSlice";
import { useAuth, useElToast, useGamesType, useGoBack, validator } from "el/utils";
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
    name: Yup.string().required().max(100).label('Name'),
    gender: Yup.string().required().label('Gender'),
    ...validator.ageRange,
    ...validator.dateRangeForEdit,
    ...validator.address,
    timezone: Yup.string().required().label('Timezone'),
    gamesType: Yup.string().required().label('Games type'),
    gameRules: Yup.string().required().label('Game Rules'),
    details: Yup.string().required().max(250).label('Details'),
    totalTeamAllowed: Yup.number().required().min(2).max(99).label('TotalTeamAllowed'),
    rosterAmount: Yup.number().required().label('RosterAmount'),
    contactNumber: Yup.number().required().label('ContactNumber'),
    contactEmail: Yup.string().required().email().label('ContactEmail')
});

export default function EditTournamentProfileScreen({ navigation, route }) {
    useGoBack();
    const { id } = route.params;
    const { user } = useAuth();
    const { sportGamesType, handlerSportTypeChanged } = useGamesType(basketballGamesType);
    const dispatch = useDispatch();
    const [profile, setProfile] = useState<TournamentModel>();
    const [associations, setAssociations] = useState<[]>();
    const toast = useElToast();

    const initValue: any = {
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
        gameRules: profile?.gameRules,
        details: profile?.details,
        totalTeamAllowed: profile?.totalTeamsAllowed,
        rosterAmount: profile?.rosterAmount,
        contactNumber: profile?.phoneNumber,
        contactEmail: profile?.email,
    };

    useEffect(() => { getTournamentProfile(); }, [id]);

    useEffect(() => { getAthleteManagedAssociations(); }, [user]);
     
    useEffect(() => {
        if(!profile?.sportType) return;
        handlerSportTypeChanged(profile.sportType)
    }, [profile?.sportType]);

    const getTournamentProfile = async () => {
        dispatch(PENDING());
        const res: ResponseResult<TournamentModel> = await tournamentService.getTournament(id);
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
        values.tournamentId = id;
        const res: any = await tournamentService.editTournament(id, values);
        if (res && res.code === 200 && res.value) {
            dispatch(SUCCESS());
            navigation.navigate({
                name: routes.TournamentProfile,
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
            <ElTitle>Edit Tournament Profile</ElTitle>
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
                        isSubmitting
                    }) =>
                        <>
                            <ElBody>Main information</ElBody>
                            <ElInput
                                defaultValue={values.name}
                                name="name"
                                placeholder="Name your Tournament"
                                onBlur={() => setFieldTouched('name')}
                                onChangeText={handleChange('name')}
                                maxLength={100}
                            />
                            <ElErrorMessage error={errors['name']} visible={touched['name']} />

                            <ElBody>Tournament Details</ElBody>
                            <ElSelectEx
                                defaultValue={values.gender}
                                items={GenderTypes}
                                name="gender"
                                onValueChange={value => setFieldValue('gender', value)}
                                placeholder="Gender"
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
                                onValueChange={value => { setFieldValue('associationId', value); }}
                                placeholder="Association Id (Optional)"
                            />

                            <ElBody>Time/Date Details</ElBody>
                            <ElSelectEx
                                defaultValue={values.timezone}
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
                                defaultValue={values.startDate}
                                name="startDate"
                                placeholder="Select start date"
                                onSelectedDate={item => setFieldValue('startDate', item)}
                            />
                            <ElErrorMessage error={errors['startDate']} visible={true} />

                            <ElDatePicker
                                defaultValue={values.endDate}
                                name="endDate"
                                placeholder="Select end date"
                                onSelectedDate={item => setFieldValue('endDate', item)}
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
                                defaultValue={values.rank}
                                items={rank}
                                name="rank"
                                onValueChange={value => setFieldValue('rank', value)}
                                placeholder="Rank"
                            />
                            <ElErrorMessage error={errors['rank']} visible={touched['rank']} />

                            <ElSelectEx
                                defaultValue={values.gamesType}
                                items={sportGamesType}
                                name="gamesType"
                                onValueChange={value => setFieldValue('gamesType', value)}
                                placeholder="Games type"
                            />
                            <ElErrorMessage
                                error={errors['gamesType']}
                                visible={touched['gamesType']}
                            />

                            {!profile.isLowStats && 
                                <>
                                    <ElSelectEx
                                        defaultValue={values.gameLength}
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
                            <ElTextarea
                                defaultValue={values.gameRules}
                                name="gameRules"
                                placeholder="Game Rules"
                                onBlur={() => setFieldTouched('gameRules')}
                                onChangeText={handleChange('gameRules')}
                                maxLength={500}
                            />
                            <ElErrorMessage error={errors['gameRules']} visible={touched['gameRules']} />

                            <ElTextarea
                                name="details"
                                placeholder="Details"
                                onBlur={() => setFieldTouched('details')}
                                onChangeText={handleChange('details')}
                                defaultValue={values.details}
                                maxLength={250}
                            />
                            <ElErrorMessage error={errors['details']} visible={touched['details']} />

                            <ElBody>Team Details</ElBody>

                            <ElInput
                                defaultValue={values.totalTeamAllowed?.toString()}
                                name="totalTeamAllowed"
                                keyboardType="numeric"
                                placeholder="Total Teams Allowed"
                                onBlur={() => setFieldTouched('totalTeamAllowed')}
                                onChangeText={handleChange('totalTeamAllowed')}
                                maxLength={2}
                            />
                            <ElErrorMessage error={errors['totalTeamAllowed']} visible={touched['totalTeamAllowed']} />

                            <ElInput
                                defaultValue={values.rosterAmount?.toString()}
                                name="rosterAmount"
                                keyboardType="numeric"
                                placeholder="Roster Amount"
                                onBlur={() => setFieldTouched('rosterAmount')}
                                onChangeText={handleChange('rosterAmount')}
                            />
                            <ElErrorMessage error={errors['rosterAmount']} visible={touched['rosterAmount']} />

                            <ElBody>Contact Details</ElBody>
                            <ElInput
                                defaultValue={values.contactNumber}
                                name="contactNumber"
                                keyboardType="numeric"
                                placeholder="Tournament Contact Number"
                                onBlur={() => setFieldTouched('contactNumber')}
                                onChangeText={handleChange('contactNumber')}
                                maxLength={11}
                            />
                            <ElErrorMessage error={errors['contactNumber']} visible={touched['contactNumber']} />

                            <ElInput
                                defaultValue={values.contactEmail}
                                name="contactEmail"
                                placeholder="Tournament Contact Email"
                                keyboardType="email-address"
                                onBlur={() => setFieldTouched('contactEmail')}
                                onChangeText={handleChange('contactEmail')}
                                maxLength={100}
                            />
                            <ElErrorMessage error={errors['contactEmail']} visible={touched['contactEmail']} />

                            <ElButton onPress={handleSubmit} style={{ marginBottom: 8 }} disabled={isSubmitting}>
                                Save
                            </ElButton>
                        </>
                    }
                </Formik>
            )}
        </ElKeyboardAvoidingView>
    );
}