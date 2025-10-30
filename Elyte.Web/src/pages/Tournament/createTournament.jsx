import React, { useState, useEffect } from 'react';
import { Box, Typography, Divider } from '@mui/material';
import {
    ElButton, ElInput, ElTitle, ElSelect, ElImageSelecter, ElDialog, ElBox,
    ElAvatar, ElFileUploader, ElDateTimePicker, ElForm, ElAgeInput, ElAutocomplete
} from 'components';
import { useHistory, useLocation } from 'react-router-dom';
import * as moment from 'moment';
import { SportTypes, timeZones, rank, basketballGamesType, gameLength, GenderTypes, tournamentType, statTrackingModule, statTrackingModules } from 'models';
import { useForm } from "react-hook-form";
import { utils, validator, useGamesType, useOfficialIds, useFormValidate, usePaymentAccounts, useFile, useManagedAssociations } from 'utils';
import { tournamentService, authService } from 'services';
import CongratulationIndex from './../Organization/congratulationIndex';
import { FileUploadType, OrganizationType, SportType } from 'enums';
import { RegionCascader } from 'pageComponents';

export default function CreateTournament () {
    const history = useHistory();
    const location = useLocation();
    const user = authService.getCurrentUser();
    const routerParams = location.state?.params;
    const form = useForm();
    const { register, watch, getValues, setValue, control, formState: { errors } } = form;
    const { sportGamesType, handlerSportTypeChanged } = useGamesType(basketballGamesType);
    const { paymentAccounts, getPaymentAccounts, configPaymentAccount } = usePaymentAccounts();
    const { officialIds } = useOfficialIds(user.id);
    const { validateDigital, validateEmail, validateStartDateCanNotLessThanToday, validateEndDateCanNotLessThanStartDate, validateTeamsAllowedForEliminationType } = useFormValidate();
    const [hideCreateTournament, setHideCreateTournament] = useState(false);
    const [isOfficial, setIsOfficial] = useState(false);
    const [isChoosePaymentAccount, setIsChoosePaymentAccount] = useState(false);
    const [showCongratulationsDialog, setShowCongratulationsDialog] = useState(false);
    const [tournamentData, setTournamentData] = useState({});
    const [url, setUrl] = useState();
    const [image, setImage] = useState();
    const { setFiles, setFormDataFiles, isFileOverSize } = useFile();
    const { associations } = useManagedAssociations(user.id);

    useEffect(() => getPaymentAccounts(), []);

    useEffect(() => {
        if (tournamentData?.image) {
            utils.readFile(tournamentData.image).then(d => setUrl(d));
        }
    }, [tournamentData]);

    const handleSaveClick = async (data) => {
        if (!hideCreateTournament) setHideCreateTournament(true);

        if (hideCreateTournament) {
            const formData = utils.formToFormData(data);
            formData.append('file', image || routerParams?.image);
            setFormDataFiles(formData);

            const res = await tournamentService.createTournament(formData);
            if (res && res.code === 200 && res.value) {
                setTournamentData({ id: res.value, image: image || routerParams?.image, ...data });
                setShowCongratulationsDialog(true);
            }
        }
    }

    const buildPageTitle = () => {
        if (!hideCreateTournament) return "Create A Tournament";

        return isOfficial ? "Official Tournament Details" : "Unofficial Tournament Details";
    }

    const handleGoToProfile = () => history.push('/tournamentProfile', { params: tournamentData.id });

    const handleConfigurePaymentAccount = () => {
        history.push('/tournamentProfile', { params: tournamentData.id });
        configPaymentAccount(OrganizationType.Tournament, tournamentData.id);
    }

    const handleSportChange = (e) => {
        var sportType = e.target.value;
        if(sportType !== SportType.Basketball && sportType !== SportType.Soccer){
            setValue('trackModule', statTrackingModule.PostGameStats);
        }
        setValue('sportType', sportType);
        handlerSportTypeChanged(e);
    }
    const getTrackModule = () => {
        if(!watch('sportType')) return '';
        return watch('sportType') === SportType.Basketball || watch('sportType') === SportType.Soccer ? getValues('trackModule') : statTrackingModule.PostGameStats;
    }

    return (
        <ElForm form={form} onSubmit={handleSaveClick} >
            <ElTitle center>{buildPageTitle()}</ElTitle>
            <Typography className="category-text">Main information</Typography>
            <ElImageSelecter name="image" label="Choose profile image" defaultValue={routerParams?.image} onImageSelected={(i) => setImage(i)} />
            <ElInput label="Tournament Name" errors={errors} inputProps={{ maxLength: 20 }} defaultValue={routerParams?.organizationName}
                {...register("name", { required: 'This field is required.' })}
            />
            <ElAutocomplete label="Association Id (Optional)" name="associationId" freeSolo errors={errors} options={associations} register={register}
                defaultValue={routerParams.associationId} disabled={routerParams.fromAssociation} renderOption={(props, option) => (<Box component="li" {...props}>{option.label} ({option.name})</Box>)}/>
            <Box className={hideCreateTournament ? 'el-hide' : ''}>
                <ElSelect label="Official Id (Optional)" options={officialIds} errors={errors} defaultValue={''}
                    {...register("officialId", { onChange: e => setIsOfficial(e.target.value != '') })}
                />
                <Typography className="category-text">Details</Typography>
                <ElSelect label="Sport Type" options={SportTypes} errors={errors} defaultValue={''}
                    {...register("sportType", { required: 'This field is required.' })} onChange={handleSportChange}
                />
                <ElSelect label="Gender" options={GenderTypes} errors={errors}
                    {...register("gender", { required: 'This field is required.' })}
                />
                <ElAgeInput errors={errors} />
                <Typography className="category-text">Time/Date Details</Typography>
                <ElSelect label="Choose a Time zone" errors={errors} options={timeZones}
                    {...register("timezone", { required: 'This field is required.' })}
                />
                <ElDateTimePicker control={control} name="startDate" label="Select start date" type="date" errors={errors} defaultValue={moment().format("YYYY-MM-DD")}
                    rules={{ required: 'This field is required.', validate: { rule1: v => validateStartDateCanNotLessThanToday(v) } }}
                />
                <ElDateTimePicker control={control} name="endDate" label="Select end date" type="date" errors={errors} defaultValue={moment().format("YYYY-MM-DD")}
                    rules={{ validate: { rule1: v => validateEndDateCanNotLessThanStartDate(v, getValues('startDate')) } }}
                />

                <RegionCascader register={register} errors={errors} />
                <Typography className="category-text">Game Details</Typography>
                <ElSelect label="Rank" errors={errors} options={rank} {...register("rank", {})} />
                <ElSelect label="Games type" errors={errors} options={sportGamesType}
                    {...register("gamesType", { required: 'This field is required.' })}
                />

                <ElSelect label="Stat Tracking Module" errors={errors} options={statTrackingModules}
                    {...register("trackModule", { required: 'This field is required.' } )} 
                    disabled={watch('sportType') !== SportType.Basketball && watch('sportType') !== SportType.Soccer}
                    value={getTrackModule()}
                />
                {
                    watch('trackModule') === statTrackingModule.LiveStatTracking &&  
                    <ElSelect label="Games length" errors={errors} options={gameLength}
                        {...register("gameLength", { required: 'This field is required.' })}
                    />
                }
                <ElSelect label="Tournament Type" errors={errors} options={tournamentType}
                    {...register("TournamentType", { required: 'This field is required.' })}
                />
                <ElInput label="Game Rules" rows={6} multiline errors={errors} inputProps={{ maxLength: 250 }}
                    {...register("gameRules", { required: 'This field is required.' })}
                />
                <ElInput label="Details" rows={6} multiline errors={errors} inputProps={{ maxLength: 250 }} defaultValue={routerParams?.organizationBio}
                    {...register("details", { required: 'This field is required.' })}
                />
                <Typography className="category-text">Team Details</Typography>
                <ElInput label="Total Teams Allowed" errors={errors} inputProps={{ maxLength: 2 }}
                    {...register("totalTeamAllowed", {
                        required: 'This field is required.',
                        validate: { rule1: v => validateDigital(v), rule2: v => validateTeamsAllowedForEliminationType(v, getValues('TournamentType')) }
                    })}
                />
                <ElInput label="Roster Amount" errors={errors} inputProps={{ maxLength: 3 }}
                    {...register("rosterAmount", {
                        required: 'This field is required.',
                        validate: { rule1: v => validateDigital(v) }
                    })}
                />
                <ElButton mt={6} type="submit">Next Step</ElButton>
            </Box>
            {
                hideCreateTournament &&
                <Box className={hideCreateTournament ? '' : 'el-hide'}>
                    {
                        isOfficial &&
                        <>
                            <Typography className="category-text">Payment Details</Typography>
                            <ElInput label="Price to Register ($)" errors={errors} inputProps={{ maxLength: 10 }}
                                {...register("registerPrice", {
                                    required: 'This field is required.',
                                    validate: { rule1: v => validator.isNonzeroDecimal(v, 2) || 'Please enter correct price!' }
                                })}
                            />
                            {
                                !Array.isNullOrEmpty(paymentAccounts) &&
                                <ElSelect label="Choose a Payment Account" options={[{ value: '', label: 'None' }, ...paymentAccounts]}
                                    {...register("paymentAccount", { onChange: e => setIsChoosePaymentAccount(e.target.value != '') })}
                                />
                            }
                        </>
                    }
                    <Typography className="category-text">File to Upload</Typography>
                    <ElFileUploader label="Upload Terms and Conditions*" type={FileUploadType.TermsAndConditions} onRegister={register} onSetFiles={setFiles} />
                    <ElFileUploader label="Upload Waiver Doc*" type={FileUploadType.WaiverDoc} onRegister={register} onSetFiles={setFiles} />
                    <ElFileUploader label="COVID 19 Waiver" type={FileUploadType.COVID19Waiver} onRegister={register} onSetFiles={setFiles} />
                    <ElFileUploader label="Additional Documents" type={FileUploadType.AdditionalDoc} onRegister={register} onSetFiles={setFiles} />
                    <Typography className="category-text">Contact Details</Typography>
                    <ElInput label="Tournament Contact Number" errors={errors} inputProps={{ maxLength: 15 }}
                        {...register("contactNumber", {
                            required: 'This field is required.',
                            validate: { rule1: v => validateDigital(v) }
                        })}
                    />
                    <ElInput label="Tournament Contact Email" errors={errors}
                        {...register("contactEmail", {
                            required: 'This field is required.',
                            validate: { rule1: v => validateEmail(v) }
                        })}
                    />
                    <Divider className="divider" />
                    <ElButton mt={6} type="submit" disabled={isFileOverSize()}>Create Tournament</ElButton>
                </Box>
            }
            <ElDialog open={showCongratulationsDialog} title="Congratulations" subTitle="You have successfully created a new tournament!"
                maxWidth={"xs"}
                actions={
                    <>
                        <ElButton onClick={handleGoToProfile}>Go to Profile</ElButton>
                        {
                            isOfficial && !isChoosePaymentAccount &&
                            <ElButton onClick={handleConfigurePaymentAccount}>Configure Account</ElButton>
                        }
                    </>
                }>
                <ElBox center mb={2} sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                    <ElAvatar src={url} />
                    <Typography ml={1} sx={{ fontSize: 20, fontWeight: 700, color: '#1F345D', overflowWrap: "anywhere" }}>{tournamentData.name}</Typography>
                </ElBox>
                <ElBox sx={{ display: 'flex', flexDirection: 'column', jflexDirection: 'column', alignItems: 'center' }}>
                    <CongratulationIndex title={"Sport"} content={tournamentData.sportType} />
                    <CongratulationIndex title={"Start"} content={tournamentData.startDate} />
                    <CongratulationIndex title={"End"} content={tournamentData.endDate} />
                    <CongratulationIndex title={"Game Type"} content={tournamentData.gamesType} />
                    <CongratulationIndex title={"Total Teams"} content={tournamentData.totalTeamAllowed} />
                    <CongratulationIndex title={"Roster Total"} content={tournamentData.rosterAmount} />
                    <CongratulationIndex title={"Details"} content={tournamentData.details} />
                </ElBox>
            </ElDialog>
        </ElForm>
    )
}