import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from 'src/app/shared/interfaces/interfaces';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterPageComponent implements OnInit, OnDestroy {

  public form!: FormGroup;
  public submited = false;
  private submSub!: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    public auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: [null, [Validators.required, Validators.pattern(/.+@.+\..+/i)]],
      password: [null, [Validators.required, Validators.minLength(6)]],
      confirm: [null, [Validators.required, this.compareToValidator()]],
    });
  }

  compareToValidator(): any {
    return (control: AbstractControl): { [key: string]: any } | null => {
      return control.value !== this.f?.password?.value
        ? { compareTo: { value: control.value } }
        : null;
    };
  }

  get f(): any {
    return this.form?.controls;
  }

  submit(): void {
    if (this.form.invalid) {
      return
    }

    this.submited = true;

    const user : User = {
      email: this.form.value.email,
      password: this.form.value.password
    }

    this.submSub = this.auth.register(user).subscribe( () => {
      this.form.reset;
      this.router.navigate(['/home']);
      this.submited = false;
    }, () => {
      this.submited = false;
    });
  }

  ngOnDestroy(): void {
    this.submSub?.unsubscribe();
  }

}
