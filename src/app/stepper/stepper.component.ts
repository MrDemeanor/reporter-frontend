import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { v4 } from "uuid";
import { utils, write } from "xlsx";
import { saveAs } from "file-saver";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Component({
  selector: "app-stepper",
  templateUrl: "./stepper.component.html",
  styleUrls: ["./stepper.component.scss"]
})
export class StepperComponent implements OnInit {
  constructor(private http: HttpClient) {}

  ngOnInit() {}

  /** Array of tests tied to ngFor on DOM. Contains:
   *    name          - Label for the test ("Test 1", "Test 2", "Midterm"...)
   *    identifier    - v4 uuid generated upon creating new test.
   *                  Used in renaming and deleting
   *    dat_file      - Body of DAT file stored in plain text
   *    dat_file_name - Name of the DAT file. Displayed in DOM via ngIf clause
   *    LO_file       - Body of Learning Objective file stored in plain text
   *    LO_file_name  - Name of the Learning Objective file. Displayed in DOM via ngIf clause
   **/
  tests = [
    {
      Name: "New Test",
      Identifier: v4(),
      DatFile: null,
      DatFileName: null,
      LOFile: null,
      LOFileName: null
    }
  ];

  globalUUID = null;

  // Public variables
  public rename: string;
  public numTests = 1;

  // View childs for programmatic DOM manipulation
  @ViewChild("basicModal", { static: false }) basicModal: any;
  @ViewChild("stepper", { static: false }) stepper: any;

  // Angular drag and drop helper function
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.tests, event.previousIndex, event.currentIndex);
  }

  // Pushes a new test object to test array with unique UUID
  addTest = () => {
    this.tests.push({
      Name: "New Test",
      Identifier: v4(),
      DatFile: null,
      DatFileName: null,
      LOFile: null,
      LOFileName: null
    });
    this.numTests++;
  };

  // Deletes a test based off of UUID
  deleteTest = uuid => {
    for (var i = 0; i < this.tests.length; i++) {
      if (uuid == this.tests[i]["Identifier"]) {
        this.tests.splice(i, 1);
        this.numTests--;
        break;
      }
    }
  };

  // Helper function to set global UUID for upcoming change
  setGlobalUUID = (uuid, show) => {
    this.globalUUID = uuid;
    if (show) {
      this.basicModal.show();
    }
  };

  // Renames a test once global UUID has been set
  renameTest = () => {
    for (var i = 0; i < this.tests.length; i++) {
      if (this.globalUUID == this.tests[i]["Identifier"]) {
        this.tests[i]["Name"] = this.rename;
        this.basicModal.hide();
        break;
      }
    }
  };

  // Assigns DAT file to test object
  selectedDataFile = event => {
    const DAT_reader = new FileReader();
    DAT_reader.readAsText(event.target.files[0]);

    DAT_reader.onload = () => {
      for (var i = 0; i < this.tests.length; i++) {
        if (this.globalUUID == this.tests[i]["Identifier"]) {
          this.tests[i]["DatFile"] = DAT_reader.result.toString();
          this.tests[i]["DatFileName"] = event.target.files[0]["name"];
        }
      }
    };
  };

  // Assigns LO file to test object
  selectedLearningObjectiveFile = event => {
    const LO_reader = new FileReader();
    LO_reader.readAsText(event.target.files[0]);

    LO_reader.onload = () => {
      for (var i = 0; i < this.tests.length; i++) {
        if (this.globalUUID == this.tests[i]["Identifier"]) {
          this.tests[i]["LOFile"] = LO_reader.result
            .toString()
            .replace(/\n/gi, "");
          this.tests[i]["LOFileName"] = event.target.files[0]["name"];
        }
      }
    };
  };

  processFiles = () => {
    const headers = new HttpHeaders();
    headers.set("Access-Control-Allow-Origin", "*");
    headers.set(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    headers.set("Content-Type", "application/json");

    this.http

      .post(
        "http://35.223.228.190:8080/api/intermediate_xlsx",
        JSON.stringify(this.tests)
      )
      .subscribe(data => {
        var wb = utils.book_new();
        wb.Props = {
          Title: "Intermediate Workbook"
        };
        wb.SheetNames.push("Intermediate Worksheet");

        var ws = utils.aoa_to_sheet(<any>data);
        wb.Sheets["Intermediate Worksheet"] = ws;

        var wbout = write(wb, { bookType: "xlsx", type: "binary" });

        function s2ab(s) {
          var buf = new ArrayBuffer(wbout.length);
          var view = new Uint8Array(buf);
          for (var i = 0; i < wbout.length; i++)
            view[i] = wbout.charCodeAt(i) & 0xff;
          return buf;
        }

        saveAs(
          new Blob([s2ab(wbout)], { type: "application/octet-stream" }),
          "IntermediateSheet.xlsx"
        );

        this.stepper.next();
      });
  };
}
