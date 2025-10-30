import React, { useEffect } from 'react';
import { ElInput, ElTitle, ElButton, ElForm, ElAgeInput, ElSelect, ElDateTimePicker, ElAutocomplete } from 'components';
import { useForm } from "react-hook-form";
import { Box, Typography } from '@mui/material';
import { validator, useGamesType, useFormValidate, useManagedAssociations } from 'utils';
import { timeZones, rank, playoffsType, basketballGamesType, gameLength, GenderTypes } from 'models';
import * as moment from 'moment';
import { leagueService, authService } from 'services';
import { useLocation, useHistory } from 'react-router-dom';
import { RegionCascader } from 'pageComponents';

export default function EditLeagueProfile () {
    const user = authService.getCurrentUser();
    const history = useHistory();
    const form = useForm();
    const { register, getValues, control, formState: { errors } } = form;
    const { sportGamesType, sportTypeChanged } = useGamesType(basketballGamesType);
    const location = useLocation();
    const league = location?.state?.params;
    const { validateDigital, validateEmail, validateEndDateCanNotLessThanStartDate, validateTeamsAllowedForEliminationType } = useFormValidate();
    const { associations } = useManagedAssociations(user.id);

    useEffect(() => {
        if(!league?.sportType) return;

        sportTypeChanged(league.sportType)
    }, [league?.sportType]);

    const handleSaveClick = async (data) => {
        data["leagueId"] = league.id;
        const res = await leagueService.updateLeagueProfile(league.id, data);
        if (res && res.code === 200) {
            history.push('/leagueProfile', { params: league.id });
        }
    };

    return (
        <ElForm form={form} onSubmit={handleSaveClick}>
            <ElTitle center>Edit League Profile</ElTitle>
            <Typography className="category-text">Main information</Typography>
            <ElInput label="League Name" errors={errors} inputProps={{ maxLength: 50 }} defaultValue={league.name}
                {...register("name", { required: 'This field is required.' })}
            />
            <Typography className="category-text">League Details</Typography>
            <ElSelect label="Gender" options={GenderTypes} errors={errors} defaultValue={league.gender}
                {...register("gender", { required: 'This field is required.' })}
            />
            <ElAgeInput errors={errors} defaultMaxAge={league.maxAge} defaultMinAge={league.minAge} />
            <ElAutocomplete label="Association Id (Optional)" name="associationId" freeSolo errors={errors} options={associations} register={register} 
                defaultValue={league.associationId} renderOption={(props, option) => (<Box component="li" {...props}>{option.label} ({option.name})</Box>)}/>
            <Typography className="category-text">Time/Date Details</Typography>
            <ElSelect label="Choose a Time zone" errors={errors} options={timeZones} defaultValue={league.timeZone}
                {...register("timezone", { required: 'This field is required.' })}
            />
            <ElDateTimePicker control={control} name="startDate" label="Select start date" type="date" errors={errors} defaultValue={moment(league.startDate).format("YYYY-MM-DD")}
                rules={{ required: 'This field is required.' }}
            />
            <ElDateTimePicker control={control} name="endDate" label="Select end date" type="date" errors={errors} defaultValue={moment(league.endDate).format("YYYY-MM-DD")}
                rules={{ validate: { rule1: v => validateEndDateCanNotLessThanStartDate(v, getValues('startDate')) } }}
            />
            <RegionCascader register={register} errors={errors} defaultCountry={league.countryCode} defaultState={league.stateCode} defaultCity={league.cityCode} />

            <Typography className="category-text">Game Details</Typography>
            <ElSelect label="Rank" errors={errors} options={rank} defaultValue={league.rank}
                {...register("rank", {})}
            />
            <ElSelect label="Games type" errors={errors} options={sportGamesType} defaultValue={league.gameType}
                {...register("gamesType", { required: 'This field is required.' })}
            />
            { 
                !league.isLowStats && 
                <ElSelect label="Games length" errors={errors} options={gameLength} defaultValue={league.gameLength}
                    {...register("gameLength", { required: 'This field is required.' })}
                />
            }
            <ElInput label="Game Rules" rows={6} multiline errors={errors} inputProps={{ maxLength: 250 }} defaultValue={league.gameRules}
                {...register("gameRules", { required: 'This field is required.' })}
            />
            <ElInput label="Number of games in season" errors={errors} inputProps={{ maxLength: 4 }} defaultValue={league.gamesNumber}
                {...register("gamesNumber", {
                    required: 'This field is required.',
                    validate: { rule1: v => validateDigital(v) }
                })}
            />
            {
                !league.isLeagueGameStarted &&
                <ElSelect label="Playoffs type" errors={errors} options={playoffsType} defaultValue={league.playoffsType}
                    {...register("playoffsType", { required: 'This field is required.' })}
                />
            }
            <ElInput label="Details" rows={6} multiline errors={errors} inputProps={{ maxLength: 250 }} defaultValue={league.details}
                {...register("details", { required: 'This field is required.' })}
            />
            <Typography className="category-text">Team Details</Typography>
            <ElInput label="Total Teams Allowed" errors={errors} inputProps={{ maxLength: 2 }} defaultValue={league.totalTeamsAllowed}
                {...register("totalTeamAllowed", {
                    required: 'This field is required.',
                    validate: { rule1: v => validateDigital(v), rule2: v => validateTeamsAllowedForEliminationType(v, getValues('playoffsType')) }
                })}
            />
            <ElInput label="Roster Amount" errors={errors} inputProps={{ maxLength: 3 }} defaultValue={league.rosterAmount}
                {...register("rosterAmount", {
                    required: 'This field is required.',
                    validate: { rule1: v => validateDigital(v) }
                })}
            />
            {
                league.isOfficial &&
                <>
                    <Typography className="category-text">Payment Details</Typography>
                    <ElInput label="Price to Register ($)" errors={errors} inputProps={{ maxLength: 10 }} defaultValue={league.registerPrice}
                        {...register("registerPrice", {
                            required: 'This field is required.',
                            validate: {
                                rule1: v => validator.isNonzeroDecimal(v, 2) || 'Please enter correct price!'
                            }
                        })}
                    />
                </>
            }
            <Typography className="category-text">Contact Details</Typography>
            <ElInput label="League Contact Number" errors={errors} inputProps={{ maxLength: 15 }} defaultValue={league.phoneNumber}
                {...register("contactNumber", {
                    required: 'This field is required.',
                    validate: { rule1: v => validateDigital(v) }
                })}
            />
            <ElInput label="League Contact Email" errors={errors} defaultValue={league.email}
                {...register("contactEmail", {
                    required: 'This field is required.',
                    validate: { rule1: v => validateEmail(v) }
                })}
            />

            <ElButton mt={6} type="submit">Save</ElButton>
        </ElForm >
    );
}
