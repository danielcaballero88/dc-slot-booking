import { Component, OnInit } from '@angular/core';
import { WeekDatesSlots } from 'src/app/models/shared';
import { LaundryBookingService } from 'src/app/services/laundry-booking.service';
import { LoginService } from 'src/app/services/login.service';

const placeholderTableData: WeekDatesSlots = {
  '2023/01/16': { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 },
  '2023/01/17': { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 },
  '2023/01/18': { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 },
  '2023/01/19': { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 },
  '2023/01/20': { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 },
  '2023/01/21': { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 },
  '2023/01/22': { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 },
}

@Component({
  selector: 'app-booking-table',
  templateUrl: './booking-table.component.html',
  styleUrls: ['./booking-table.component.scss']
})
export class BookingTableComponent implements OnInit {
  slotsData = {
    0: {startHour: 7, endHour: 10},
    1: {startHour: 10, endHour: 13},
    2: {startHour: 13, endHour: 16},
    3: {startHour: 16, endHour: 19},
    4: {startHour: 19, endHour: 22},
  };

  tableData: WeekDatesSlots = {...placeholderTableData};

  constructor(private laundryBookingService: LaundryBookingService, private loginService: LoginService) {}

  ngOnInit(): void {
    // If already logged in, update table data.
    if (this.loginService.checkStatus()) {
      this.updateTable()
    };

    // If not logged in, listen to the login subject.
    this.loginService.LoginSubject.subscribe({
      next: (data) => {
        this.updateTable();
      }
    })

    // If logged in, listen to the logout subject.
    this.loginService.LogoutSubject.subscribe({
      next: () => {
        this.tableData = {...placeholderTableData};
      }
    })
  }

  updateTable() {
    this.laundryBookingService.getWeek(0).subscribe({
      next: (data) => {
        console.log({...this.tableData});
        console.log({...data});
        this.tableData = {...data};
      },
      error: (err) => {
        console.error(err);
      }
    })
  }

  getCellData(dateStr: string, slotIdStr: string) {
    const slotId = Number(slotIdStr);
    return this.tableData[dateStr][slotId];
  }
}