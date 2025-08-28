import { Component, ViewChild } from '@angular/core';
import { MaterialModule } from '../../../MaterialModule';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatTableDataSource } from '@angular/material/table';
import { ServicesService } from '../../../API/services.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgToastService } from 'ng-angular-popup';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import * as XLSX from "xlsx";
import Swal from 'sweetalert2';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-editdocumentupload',
  standalone: true,
  imports: [MaterialModule, CommonModule,
    FormsModule,
    NgSelectModule],
  templateUrl: './editdocumentupload.component.html',
  styleUrl: './editdocumentupload.component.scss'
})
export class EditdocumentuploadComponent {
  @ViewChild('MatPaginator') paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  vendor: any = []
  SPName: any = 'INUR_GetASNApprovalDatas'
  UserType: any;
  SerialNo: any = 0;
  date = new Date();
  Filter: any = {
    fromdate: '',
    todate: ''
  };
  HeaderTable: any = 'INUR_ASNR';
  TransType: any = 'T'
  linearray2: Array<any> = [];
  DetailData: any = [{}];
  DetailData1: any = [{}];
  getLoginDetails: any;
  expandedElement: any | null = null;
  newTableDataSource!: MatTableDataSource<any>;
  innerTableDataSource!: MatTableDataSource<any>;
  displayedColumns1: string[] = [];
  innerTableColumns: string[] = [];
  constructor(
    private dataService: ServicesService,
    private spinner: NgxSpinnerService,
    private toastr: NgToastService,

  ) {

    this.newTableDataSource = new MatTableDataSource<any>([{}]);
    this.innerTableDataSource = new MatTableDataSource<any>([{}]);
  }


  ngOnInit(): void {
    var loginDetails: any = localStorage.getItem("LoginDetails");
    this.getLoginDetails = JSON.parse(loginDetails);
    this.vendor = this.getLoginDetails.EmployeeCode;
    this.UserType = this.getLoginDetails.LoginType;
    this.Filter.fromdate = (JSON.stringify(new Date(this.date.getFullYear(), this.date.getMonth(), 2))).slice(1, 11);
    this.Filter.todate = (JSON.stringify(new Date(this.date.getFullYear(), this.date.getMonth() + 1, 1))).slice(1, 11);
    // this.DetailData = ShowColumn;
    // this.DetailData1 = ShowColumn1;
    // this.displayedColumns1 = ShowColumn.map((Col => Col.Column))
    // this.innerTableColumns = ShowColumn1.map((Col => Col.Column))
    // this.getASNApprovalList()
  }

    Clear() {
      this.linearray2 = [];
    //  this.getASNReportList()
    }
  
    
      applyFilter(event: any) {
        let filterValue = event.target.value;
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
        this.newTableDataSource.filter = filterValue;
      }
    
      exportexcel(): void {
        debugger
        var table: any[] = [];
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.newTableDataSource.filteredData);
        /* generate workbook and add the worksheet */
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        /* save to file */
        const now = new Date();
        const formattedDateTime = now.toLocaleString('en-GB').replace(/[/:, ]/g, '-');
        var FileName = 'ASN Approval Details ' + '-' + formattedDateTime + '.xlsx'
        XLSX.writeFile(wb, FileName);
      }
}
