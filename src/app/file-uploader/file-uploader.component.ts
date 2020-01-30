import { Component, EventEmitter, ViewChild } from "@angular/core";
import { UploadFile, UploadInput, UploadOutput } from "ng-uikit-pro-standard";
import { humanizeBytes } from "ng-uikit-pro-standard";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { utils, write } from "xlsx";
import { saveAs } from "file-saver";
import { FormBuilder, FormGroup } from "@angular/forms";

@Component({
  selector: "app-file-uploader",
  templateUrl: "./file-uploader.component.html",
  styleUrls: ["./file-uploader.component.scss"]
})
export class FileUploaderComponent {
  formData: FormData;
  uploadForm: FormGroup;
  fileToUpload: File = null;
  public fileName = null;
  @ViewChild("stepper", { static: false }) stepper: any;

  constructor(private formBuilder: FormBuilder, private http: HttpClient) {}

  ngOnInit() {
    this.uploadForm = this.formBuilder.group({
      profile: [""]
    });
  }

  storeFile(files: FileList) {
    this.fileName = files.item(0).name;
    this.uploadForm.get("profile").setValue(files.item(0));
  }

  processIntermediateXLSX() {
    const formData = new FormData();
    formData.append("file", this.uploadForm.get("profile").value);

    const headers = new HttpHeaders();
    headers.set("Access-Control-Allow-Origin", "*");
    headers.set(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    headers.set("Content-Type", "application/json");

    this.http
      .post("http://localhost:8080/api/final_xlsx", formData)
      .subscribe(data => {
        var wb = utils.book_new();
        wb.Props = {
          Title: "Final Workbook"
        };
        wb.SheetNames.push("Final Worksheet");

        var ws = utils.aoa_to_sheet(<any>data);
        wb.Sheets["Final Worksheet"] = ws;

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
          "FinalSheet.xlsx"
        );

        // this.stepper.next();
      });
  }
}
