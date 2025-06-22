import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistrarVentaPage } from './registrar-venta.page';

describe('RegistrarVentaPage', () => {
  let component: RegistrarVentaPage;
  let fixture: ComponentFixture<RegistrarVentaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrarVentaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
