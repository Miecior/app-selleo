import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import TimePicker from '@mui/lab/TimePicker';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Autocomplete from '@mui/material/Autocomplete';
import { useSnackbar } from 'notistack';
import plLocale from 'date-fns/locale/pl';
import './EntryListItemForm.scss';
import calendarEntrySchema from '../../schemas/calendarEntrySchema';

// model - entry
// const entriesExmaple = [
//   {
//     startTime: '11:00',
//     endTime: '12:00',
//     order: 0,
//     _id: '0',
//     tag: 'Tag1 dla test1',
//     tagId: '1',
//     tagBundle: 'FirmaTest1',
//     tagBundleId: '0',
//   },
// ];

const EntryListItemForm = ({
  entries,
  bundleArray,
  tagsArray,
  filter,
  setTagsState,
  initialValues,
}) => {
  const [changesInEntry, setChangesInEntry] = useState(false);
  const [valueTime1, setValueTime1] = useState(null);
  const [valueTime2, setValueTime2] = useState(null);
  const [bundleIndexState, setBundleIndexState] = useState('');
  const [bundleId, setBundleId] = useState('');
  const [valueTag, setValueTag] = useState(null);
  const [tagsArrayCurrent, setTagsArrayCurrent] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const [initialStart] = useState('initial');

  const showSnackbarMsg = (msg, variant) => {
    enqueueSnackbar(msg, { variant });
  };

  const formik = useFormik({
    initialValues,
    onSubmit: (event) => {
      console.log('submit', event);
      console.log('changesInEntry', changesInEntry);
      if (changesInEntry) {
        showSnackbarMsg('run Submit', 'success');
      }
    },
    validationSchema: calendarEntrySchema,
    isInitialValid: false,
  });

  const handleSelectBundle = (indexArray) => {
    const bundleObj = bundleArray[indexArray];
    setValueTag('');
    formik.setFieldValue('tag', '');
    setBundleIndexState(indexArray);
    setBundleId(bundleObj._id);
    formik.setFieldValue('bundleId', bundleObj._id);
    formik.setFieldValue('bundle', bundleObj.name);
  };

  const handleSelectAddTag = (newValue) => {
    if (typeof newValue === 'string') {
      setValueTag({
        name: newValue,
      });
      formik.setFieldValue('tag', newValue);
    } else if (newValue && newValue.inputValue) {
      // Create a new value from the user input
      setValueTag({
        name: newValue.inputValue,
      });
      const newTag = {
        _id: '0',
        name: newValue.inputValue,
        tagBundleId: formik.values.bundleId,
      };
      setTagsState([...tagsArray, newTag]);
      // and add to frontend
      // save to backend
      // formik.setFieldValue('tag', newValue.inputValue);
    } else {
      setValueTag(newValue);
      if (newValue && newValue.name) {
        formik.setFieldValue('tag', newValue.name);
      } else {
        formik.setFieldValue('tag', null);
      }
    }
  };

  useEffect(() => {
    const startTime = entries.startTime.split(':');
    const endTime = entries.endTime.split(':');
    if (startTime.length === 2) {
      const newTime1 = new Date();
      newTime1.setHours(startTime[0], startTime[1]);
      setValueTime1(newTime1);
      formik.setFieldValue('timeDate1', newTime1);
    }
    if (endTime.length === 2) {
      const newTime2 = new Date();
      newTime2.setHours(endTime[0], endTime[1]);
      setValueTime2(newTime2);
      formik.setFieldValue('timeDate2', newTime2);
    }
    handleSelectBundle(0);
    handleSelectAddTag('newTagName');
    setChangesInEntry(false);
  }, [initialStart]);

  useEffect(() => {
    const newTagArray = tagsArray.filter((tagItem) => tagItem.tagBundleId === bundleId);
    if (newTagArray) setTagsArrayCurrent(newTagArray);
  }, [tagsArray]);

  useEffect(() => {
    setTagsArrayCurrent(tagsArray.filter((tagItem) => tagItem.tagBundleId === bundleId));
  }, [bundleId]);

  return (
    <form>
      <Box
        className="entryListBox"
        sx={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDateFns} locale={plLocale}>
          <div style={{ width: '110px' }}>
            <TimePicker
              name="timeDate1"
              value={valueTime1}
              onChange={(newValue1) => {
                setValueTime1(newValue1);
                formik.setFieldValue('timeDate1', newValue1);
              }}
              onAccept={() => {
                setChangesInEntry(true);
                formik.handleSubmit();
              }}
              renderInput={(params1) => (
                <TextField
                  onBlur={() => {
                    formik.handleSubmit();
                  }}
                  {...params1}
                />
              )}
              isInvalid={formik.errors.timeDate1}
            />
          </div>
        </LocalizationProvider>
        <LocalizationProvider dateAdapter={AdapterDateFns} locale={plLocale}>
          <div style={{ width: '110px' }}>
            <TimePicker
              name="timeDate2"
              value={valueTime2}
              onChange={(newValue2) => {
                setValueTime2(newValue2);
                formik.setFieldValue('timeDate2', newValue2);
              }}
              onAccept={() => {
                setChangesInEntry(true);
                formik.handleSubmit();
              }}
              renderInput={(params2) => (
                <TextField
                  onBlur={() => {
                    formik.handleSubmit();
                  }}
                  {...params2}
                />
              )}
              isInvalid={formik.errors.timeDate2}
            />
          </div>
        </LocalizationProvider>
        <Box sx={{ width: 150 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Bundle</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={bundleIndexState}
              label="Bundle"
              name="bundle"
              onChange={(newValueBundle) => {
                handleSelectBundle(newValueBundle.target.value);
              }}
              onAccept={() => {
                setChangesInEntry(true);
              }}
              isInvalid={formik.errors.bundle}
              onBlur={() => {
                formik.handleSubmit();
              }}
            >
              {bundleArray.map((bundle, index) => {
                return (
                  <MenuItem key={bundle._id} value={index}>
                    {bundle.name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Box>
        <Autocomplete
          name="tag"
          value={valueTag}
          onChange={(event, newValue) => {
            handleSelectAddTag(newValue);
            setChangesInEntry(true);
          }}
          filterOptions={(options, params) => {
            const filtered = filter(options, params);
            const { inputValue } = params;
            const isExisting = options.some((option) => inputValue === option.name);
            if (inputValue !== '' && !isExisting) {
              filtered.push({
                inputValue,
                name: `Utwórz i dodaj nowy Tag: "${inputValue}"`,
              });
            }
            return filtered;
          }}
          selectOnFocus
          clearOnBlur
          onBlur={() => {
            formik.handleSubmit();
          }}
          handleHomeEndKeys
          id="free-solo-with-text-demo"
          options={tagsArrayCurrent}
          getOptionLabel={(option) => {
            // Value selected with enter, right from the input
            if (typeof option === 'string') {
              return option;
            }
            // Add "xxx" option created dynamically
            if (option.inputValue) {
              return option.inputValue;
            }
            // Regular option
            return option.name;
          }}
          renderOption={(props, option) => <li {...props}>{option.name}</li>}
          sx={{ width: 300 }}
          freeSolo
          renderInput={(params) => <TextField {...params} label="Wybierz tag lub dodaj nowy Tag" />}
          disabled={formik.errors.bundle}
          isInvalid={formik.errors.tag}
        />
      </Box>
    </form>
  );
};

export default EntryListItemForm;
