import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Nanograma } from './nanograma';

describe('Nanograma', () => {
  let component: Nanograma;
  let fixture: ComponentFixture<Nanograma>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Nanograma],
    }).compileComponents();

    fixture = TestBed.createComponent(Nanograma);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
