import React, { useEffect } from 'react';
import { ElInput, ElTitle, ElButton, ElSelect, ElDateTimePicker, ElForm, ElAgeInput, ElAutocomplete } from 'components';
import { useForm } from "react-hook-form";
import { Box, Typography } from '@mui/material';
import { validator, useGamesType, useFormValidate, useManagedAssociations } from 'utils';
import { timeZones, rank, tournamentType, basketballGamesType, gameLength, GenderTypes } from 'models';
import * as moment from 'moment';
import { tournamentService, authService } from 'services';
import { useLocation, useHistory } from 'react-router-dom';
import { RegionCascader } from 'pageComponents';

export default function EditTournamentProfile () {
    const user = authService.getCurrentUser();
    const history = useHistory();
    const location = useLocation();
    const tournament = location?.state?.params;
    const form = useForm();
    const { register, getValues, control, formState: { errors } } = form;
    const { sportGamesType, sportTypeChanged } = useGamesType(basketballGamesType);
    const { validateDigital, validateEmail, validateEndDateCanNotLessThanStartDate, validateTeamsAllowedForEliminationType } = useFormValidate();
    const { associations } = useManagedAssociations(user.id);

    useEffect(() => {
        if(!tournament?.sportType) return;
        sportTypeChanged(tournament.sportType)
    }, [tournament?.sportType]);

    const handleSaveClick = async (data) => {
        data["tournamentId"] = tournament.id;
        const res = await tournamentService.updateTournamentProfile(tournament.id, data);
        if (res && res.code === 200) {
            history.push('/tournamentProfile', { params: tournament.id });
        }
    };

    return (
        <ElForm form={form} onSubmit={handleSaveClick} >
            <ElTitle center>Edit Tournament Profile</ElTitle>
            <Typography className="category-text">Main information</Typography>
            <ElInput label="Tournament Name" errors={errors} inputProps={{ maxLength: 50 }} defaultValue={tournament.name}
                {...register("name", { required: { message: 'This field is required.' } })}
            />
            <Typography className="category-text">Tournament Details</Typography>
            <ElSelect label="Gender" options={GenderTypes} errors={errors} defaultValue={tournament.gender}
                {...register("gender", { required: 'This field is required.' })}
            />
            <ElAgeInput errors={errors} defaultMaxAge={tournament.maxAge} defaultMinAge={tournament.minAge} />
            <ElAutocomplete label="Association Id (Optional)" name="associationId" freeSolo errors={errors} options={associations} register={register} defaultValue={tournament.associationId} renderOption={(props, option) => (<Box component="li" {...props}>{option.label} ({option.name})</Box>)}/>
            <Typography className="category-text">Time/Date Details</Typography>
            <ElSelect label="Choose a Time zone" errors={errors} options={timeZones} defaultValue={tournament.timeZone}
                {...register("timezone", { required: 'This field is required.' })}
            />
            <ElDateTimePicker control={control} name="startDate" label="Select start date" type="date" errors={errors} defaultValue={moment(tournament.startDate).format("YYYY-MM-DD")}
                rules={{ required: 'This field is required.' }}
            />
            <ElDateTimePicker control={control} name="endDate" label="Select end date" type="date" errors={errors} defaultValue={moment(tournament.endDate).format("YYYY-MM-DD")}
                rules={{
                    validate: { rule1: v => validateEndDateCanNotLessThanStartDate(v, getValues('startDate')) }
                }}
            />
            <RegionCascader register={register} errors={errors} defaultCountry={tournament.countryCode} defaultState={tournament.stateCode} defaultCity={tournament.cityCode} />
            <Typography className="category-text">Game Details</Typography>
            <ElSelect label="Rank" errors={errors} options={rank} defaultValue={tournament.rank}
                {...register("rank", {})}
            />
            <ElSelect label="Games type" errors={errors} options={sportGamesType} defaultValue={tournament.gameType}
                {...register("gamesType", { required: 'This field is required.' })}
            />
            <ElInput label="Game Rules" rows={6} multiline errors={errors} inputProps={{ maxLength: 250 }} defaultValue={tournament.gameRules}
                {...register("gameRules", { required: 'This field is required.' })}
            />
            { 
                !tournament.isLowStats && 
                <ElSelect label="Games length" errors={errors} options={gameLength} defaultValue={tournament.gameLength}
                    {...register("gameLength", { required: 'This field is required.' })}
                />
            }
            {
                !tournament.isTournamentGameStarted &&
                <ElSelect label="Tournament Type" errors={errors} options={tournamentType} defaultValue={tournament.tournamentType}
                    {...register("TournamentType", { required: 'This field is required.' })}
                />
            }
            <ElInput label="Details" rows={6} multiline errors={errors} inputProps={{ maxLength: 250 }} defaultValue={tournament.details}
                {...register("details", { required: 'This field is required.' })}
            />
            <Typography className="category-text">Team Details</Typography>
            <ElInput label="Total Teams Allowed" errors={errors} inputProps={{ maxLength: 2 }} defaultValue={tournament.totalTeamsAllowed}
                {...register("totalTeamAllowed", {
                    required: 'This field is required.',
                    validate: { rule1: v => validateDigital(v), rule2: v => validateTeamsAllowedForEliminationType(v, getValues('TournamentType')) }
                })}
            />
            <ElInput label="Roster Amount" errors={errors} inputProps={{ maxLength: 3 }} defaultValue={tournament.rosterAmount}
                {...register("rosterAmount", {
                    required: 'This field is required.',
                    validate: { rule1: v => validateDigital(v) }
                })}
            />
            {
                tournament.isOfficial &&
                <>
                    <Typography className="category-text">Payment Details</Typography>
                    <ElInput label="Price to Register ($)" errors={errors} inputProps={{ maxLength: 10 }} defaultValue={tournament.registerPrice}
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
            <ElInput label="Tournament Contact Number" errors={errors} inputProps={{ maxLength: 15 }} defaultValue={tournament.phoneNumber}
                {...register("contactNumber", {
                    required: 'This field is required.',
                    validate: { rule1: v => validateDigital(v) }
                })}
            />
            <ElInput label="Tournament Contact Email" errors={errors} defaultValue={tournament.email}
                {...register("contactEmail", {
                    required: 'This field is required.',
                    validate: { rule1: v => validateEmail(v) }
                })}
            />
            <ElButton mt={6} type="submit">Save</ElButton>
        </ElForm>
    );
}
