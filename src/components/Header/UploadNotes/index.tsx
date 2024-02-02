import React, { useState, useEffect, Component, Fragment } from 'react';
import { uploadNotes, uploadMembers } from '../../../services/cariclub';

import Papa from 'papaparse';
import swal from 'sweetalert';

import { 
	UploadTrigger,
  DropdownButton,
  UploadDropdownSection,
  UploadDropdownRow,
  Overlay
} from './styles.css';

interface IProps {
  org_key: any;
}

const UploadNotes = ({ org_key }: IProps) => {

    const [toggleExpand, setToggleExpand] = useState(false)

    const uploadNotesHandler = async (event: any) => {
      Papa.parse(event.target.files[0], {
          header: true,
          skipEmptyLines: true,
          complete: async function (results: any) {
            console.log(results.data)

            //parse csv and call api
            const res = await uploadNotes(results.data);
            if (res && res.status == 200) {
              swal(
                'Success!',
                'Notes are uploaded successfully!',
                'success'
              )
            } else {
              swal(
                'Failed!',
                'Error occurred while uploading notes!',
                'error'
              )
            }
          },
        });
    };

    const uploadMembersHandler = async (event: any) => {
      var formData = new FormData();
      var imagefile = document.querySelector('#file');
      formData.append("csvUpload", event.target.files[0]);
      const res = await uploadMembers(org_key, formData);
      console.log(res)
      if (res.status == 200 && res.data.code == 'e58') {
        swal(
          'Success!',
          'Members are uploaded successfully!',
          'success'
        )
      } else {
        swal(
          'Failed!',
          'Error occurred while uploading Members!',
          'error'
        )
      }
    };

    return (
      <UploadTrigger>
        {toggleExpand && (
          <Overlay
            onClick={() => {
              setToggleExpand(false);
            }}
          ></Overlay>
        )}
        <DropdownButton
          onClick={() => setToggleExpand(!toggleExpand)}
        >+</DropdownButton>
        { toggleExpand &&
          <UploadDropdownSection>
            <UploadDropdownRow>
              <input
                  type="file"
                  name="file"
                  accept=".csv"
                  onChange={uploadNotesHandler}
                  style={{ display: "block", margin: "10px auto" }}
              />
              <span>Upload Notes</span>
            </UploadDropdownRow>
            <UploadDropdownRow>
              <input
                  type="file"
                  name="file"
                  accept=".csv"
                  onChange={uploadMembersHandler}
                  style={{ display: "block", margin: "10px auto" }}
              />
              <span>Upload Members</span>
            </UploadDropdownRow>
          </UploadDropdownSection>
        }
      </UploadTrigger>
    );
}

export default UploadNotes;
