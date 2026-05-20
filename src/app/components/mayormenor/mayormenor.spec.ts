import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Mayormenor } from './mayormenor';

describe('Mayormenor', () => {
  let component: Mayormenor;
  let fixture: ComponentFixture<Mayormenor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Mayormenor],
    }).compileComponents();

    fixture = TestBed.createComponent(Mayormenor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
