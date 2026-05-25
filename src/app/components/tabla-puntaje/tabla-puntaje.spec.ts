import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaPuntaje } from './tabla-puntaje';

describe('TablaPuntaje', () => {
  let component: TablaPuntaje;
  let fixture: ComponentFixture<TablaPuntaje>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablaPuntaje],
    }).compileComponents();

    fixture = TestBed.createComponent(TablaPuntaje);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
