import React, { useState, useEffect } from 'react';
import { Box, Typography, Divider } from '@mui/material';
import {
    ElButton, ElInput, ElTitle, ElSelect, ElImageSelecter, ElDateTimePicker,
    ElDialog, ElBox, ElAvatar, ElFileUploader, ElForm, ElAgeInput, ElAutocomplete
} from 'components';
import { useHistory, useLocation } from 'react-router-dom';
import { SportTypes, timeZones, rank, playoffsType, basketballGamesType, gameLength, GenderTypes, statTrackingModule, statTrackingModules } from 'models';
import { useForm } from "react-hook-form";
import { utils, validator, useGamesType, useOfficialIds, useFormValidate, usePaymentAccounts, useFile, useManagedAssociations } from 'utils';
import { leagueService, authService } from 'services';
import * as moment from 'moment';
import CongratulationIndex from './../Organization/congratulationIndex';
import { RegionCascader } from 'pageComponents';
import { FileUploadType, OrganizationType, SportType } from 'enums';

export default function CreateLeague () {
    const history = useHistory();
    const location = useLocation();
    const routerParams = location.state?.params;
    const user = authService.getCurrentUser();
    const form = useForm();
    const { register, watch, getValues, setValue, control, formState: { errors } } = form;
    const { validateDigital, validateEmail, validateStartDateCanNotLessThanToday, validateEndDateCanNotLessThanStartDate, validateTeamsAllowedForEliminationType, validateTeamsAllowed } = useFormValidate();
    const { sportGamesType, handlerSportTypeChanged } = useGamesType(basketballGamesType);
    const { officialIds } = useOfficialIds(user.id);
    const { paymentAccounts, getPaymentAccounts, configPaymentAccount } = usePaymentAccounts();
    const [hideCreateLeague, setHideCreateLeague] = useState(false);
    const [isOfficial, setIsOfficial] = useState(false);
    const [isChoosePaymentAccount, setIsChoosePaymentAccount] = useState(false);
    const [image, setImage] = useState();
    const [leagueData, setLeagueData] = useState({});
    const [showCongratulationsDialog, setShowCongratulationsDialog] = useState(false);
    const [url, setUrl] = useState();
    const { setFiles, setFormDataFiles, isFileOverSize } = useFile();
    const { associations } = useManagedAssociations(user.id);

    useEffect(() => getPaymentAccounts(), []);

    useEffect(() => {
        if (leagueData?.image) {
            utils.readFile(leagueData.image).then(d => setUrl(d));
        }
    }, [leagueData]);

    const handleSaveClick = async (data) => {
        if (!hideCreateLeague) setHideCreateLeague(true);

        if (hideCreateLeague) {
            const formData = utils.formToFormData(data);
            formData.append('file', image || routerParams?.image);
            setFormDataFiles(formData);
            const res = await leagueService.createLeague(formData);
            if (res && res.code === 200 && res.value) {
                setLeagueData({ id: res.value, image: image || routerParams?.image, ...data });
                setShowCongratulationsDialog(true);
            }
        }
    }

    const buildPageTitle = () => {
        if (!hideCreateLeague) return "Create A League";

        return isOfficial ? "Official League Details" : "Unofficial League Details";
    }

    const handleGoToProfile = () => history.push('/leagueProfile', { params: leagueData.id });

    const handleConfigurePaymentAccount = () => {
        history.push('/leagueProfile', { params: leagueData.id });
        configPaymentAccount(OrganizationType.League, leagueData.id);
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
            <ElInput label="Name your League" errors={errors} inputProps={{ maxLength: 20 }} defaultValue={routerParams?.organizationName}
                {...register("name", { required: 'This field is required.' })}
            />
            <ElAutocomplete label="Association Id (Optional)" name="associationId" freeSolo errors={errors} options={associations} register={register}
                defaultValue={routerParams.associationId} disabled={routerParams.fromAssociation} renderOption={(props, option) => (<Box component="li" {...props}>{option.label} ({option.name})</Box>)} />
            <Box className={hideCreateLeague ? 'el-hide' : ''}>
                <ElSelect label="Official Id (Optional)" options={officialIds} errors={errors}
                    {...register("officialId", { onChange: e => setIsOfficial(e.target.value != '') })}
                />
                <Typography className="category-text">League Details</Typography>
                <ElSelect label="Sport Type" options={SportTypes} errors={errors}
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
                <ElSelect label="Rank" errors={errors} options={rank}
                    {...register("rank", {})}
                />
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
                <ElInput label="Number of games in season" errors={errors} inputProps={{ maxLength: 4 }}
                    {...register("gamesNumber", { required: 'This field is required.', validate: { rule1: v => validateDigital(v) } })}
                />
                <ElSelect label="Playoffs type" errors={errors} options={playoffsType}
                    {...register("playoffsType", { required: 'This field is required.' })}
                />
                <ElInput label="Game Rules" rows={6} multiline errors={errors} inputProps={{ maxLength: 250 }}
                    {...register("gameRules", { required: 'This field is required.' })}
                />
                <ElInput label="Details" rows={6} multiline errors={errors} inputProps={{ maxLength: 250 }} defaultValue={routerParams?.organizationBio}
                    {...register("details", { required: 'This field is required.' })}
                />
                <Typography className="category-text">Team Details</Typography>
                <ElInput label="Total Teams Allowed" errors={errors} inputProps={{ maxLength: 2 }}
                    {...register("totalTeamAllowed",
                        {
                            required: 'This field is required.', validate: {
                                rule1: v => validateDigital(v),
                                rule2: v => validateTeamsAllowed(v),
                                rule3: v => validateTeamsAllowedForEliminationType(v, getValues('playoffsType')),
                            }
                        })
                    }
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
                hideCreateLeague &&
                <Box className={hideCreateLeague ? '' : 'el-hide'}>
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
                    <ElInput label="League Contact Number" errors={errors} inputProps={{ maxLength: 15 }}
                        {...register("contactNumber", { required: 'This field is required.', validate: { rule1: v => validateDigital(v) } })}
                    />
                    <ElInput label="League Contact Email" errors={errors}
                        {...register("contactEmail", {
                            required: 'This field is required.',
                            validate: { rule1: v => validateEmail(v) }
                        })}
                    />
                    <Divider className="divider" />
                    <ElButton mt={6} type="submit" disabled={isFileOverSize()}>Create League</ElButton>
                </Box>
            }
            <ElDialog
                maxWidth={"xs"}
                open={showCongratulationsDialog} title="Congratulations" subTitle="You have successfully created a new league!"
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
                    <Typography ml={1} sx={{ fontSize: 20, fontWeight: 700, color: '#1F345D', overflowWrap: "anywhere" }}>{leagueData.name}</Typography>
                </ElBox>
                <ElBox sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <CongratulationIndex title={"Sport"} content={leagueData.sportType} />
                    <CongratulationIndex title={"Start"} content={leagueData.startDate} />
                    <CongratulationIndex title={"End"} content={leagueData.endDate} />
                    <CongratulationIndex title={"Game Type"} content={leagueData.gamesType} />
                    <CongratulationIndex title={"Total Teams"} content={leagueData.totalTeamAllowed} />
                    <CongratulationIndex title={"Roster Total"} content={leagueData.rosterAmount} />
                    <CongratulationIndex title={"Details"} content={leagueData.details} />
                </ElBox>
            </ElDialog>
        </ElForm>
    )
}