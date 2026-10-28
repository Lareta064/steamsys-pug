<?
require($_SERVER["DOCUMENT_ROOT"] . "/bitrix/header.php");
$APPLICATION->SetPageProperty("TITLE", "Опросный лист Паровой теплообменник");
$APPLICATION->SetPageProperty("description", "Опросный лист для расчета предложения по поставке парового теплообменника от Паровых систем");
require 'inc.functions.php';
$APPLICATION->SetTitle("Опросный лист Паровой теплообменник");
$data = dataForms();
if ($USER->IsAdmin() || 1) {
    ?>
    <link rel="stylesheet" href="/forms/css/main.css">
    <script src="/forms/js/main.js"></script>
    <?
    include 'new/index6.php';
} else {
    ?>

    <form action="<?= $APPLICATION->GetCurPage(true); ?>" method="POST" role="form">
        <? include_once $_SERVER['DOCUMENT_ROOT'] . '/include/recaptcha.php' ?>
        <input type="hidden" name="PAGE" value="<?= $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI'] ?>">
        <input type="hidden" name="save" value="Y">
        <input type="hidden" name="TITLE" value="Опросный лист Паровой теплообменник">
        <input type="hidden" name="rand" value="<?= rand() ?>">
        <? foreach ($_GET as $key => $item) {
            ?>
            <input type="hidden" name="<?= $key ?>" value="<?= $item ?>">
            <?
        } ?>
        <div class="alert alert-warning reqwarning" role="alert" style="display: none">
            Пожалуйста заполните выделенные поля - они обязательны.
        </div>
        <? ob_start(); ?>
        <table class="table">
            <tbody>
            <tr>
                <td width="30%">
                    <div class="cel-title">Организация:</div>
                </td>
                <td width="70%"><input type="text" class="form-control" required placeholder="название компании"
                                       name="COMPANY_TITLE" value="<?= $data['COMPANY_TITLE'] ?>"></td>
            </tr>
            <tr>
                <td>
                    <div class="cel-title">Контактное лицо</div>
                </td>
                <td><input type="text" class="form-control" required placeholder="контактное лицо"
                           name="NAME"
                           value="<?= $data['NAME'] ?>"></td>
            </tr>
            <tr>
                <td>
                    <div class="cel-title">Телефон/факс:</div>
                </td>
                <td><input type="text" class="form-control" required placeholder="+7 (000) 000-00-00"
                           name="PHONE"
                           value="<?= $data['PHONE'] ?>"></td>
            </tr>
            <tr>
                <td>
                    <div class="cel-title">E-mail:</div>
                </td>
                <td><input type="text" class="form-control" required placeholder="Ваш e-mail"
                           name="EMAIL"
                           value="<?= $data['EMAIL'] ?>"></td>
            </tr>
            </tbody>
        </table>
        <div class="alert alert-warning formerror" role="alert" style="display: none">
        </div>
        <div class="form-group">
            <table border="1" bordercolor="#ccc" cellspacing="0" width="100%">
                <tr>
                    <td width="30" align="center" valign="middle">№</td>
                    <td align="center" valign="middle">Параметр</td>
                    <td align="center" valign="middle">Единица измерения</td>
                    <td valign="middle"><p align="center"> </p></td>
                </tr>
                <tr>
                    <td align="center" valign="middle" style="text-align: center"><p align="center"> </p></td>
                    <td colspan="3" align="center" valign="middle">
                        <span><strong>Греющая    сторона – пар</strong></span></td>
                </tr>
                <tr>
                    <td align="center" valign="middle" style="text-align: center"><p>1* </p></td>
                    <td valign="middle">
                        <div class="cel-title">Тепловая нагрузка максимальная</div>
                    </td>
                    <td align="center" valign="middle">кВт/Гкал/ч</td>
                    <td valign="middle">
                        <input type="text" name="p1" value="<?= $data['p1'] ?>" class="form-control" required>
                    </td>
                </tr>
                <tr>
                    <td align="center" valign="middle" style="text-align: center"><p>2 </p></td>
                    <td valign="middle">
                        <div class="cel-title">Тепловая нагрузка минимальная</div>
                    </td>
                    <td align="center" valign="middle">кВт/Гкал/ч</td>
                    <td valign="middle">
                        <input type="text" name="p2" value="<?= $data['p2'] ?>" class="form-control">
                    </td>
                </tr>
                <tr>
                    <td align="center" valign="middle" style="text-align: center"><p>3* </p></td>
                    <td valign="middle">
                        <div class="cel-title">Тип нагрузки</div>
                    </td>
                    <td valign="middle"><p align="center"> </p></td>
                    <td valign="middle">
                        <div class="radio required-radio cel-title">
                            <label class="radio-inline">
                                <input type="radio" name="nagrtype" value="1"
                                       <? if ($data['nagrtype'] == 1): ?>checked<? endif; ?>>Отопление
                            </label>
                            <label class="radio-inline">
                                <input type="radio" name="nagrtype" value="2"
                                       <? if ($data['nagrtype'] == 2): ?>checked<? endif; ?>>Вентиляция
                            </label><br>
                            <label class="radio-inline">
                                <input type="radio" name="nagrtype" value="3"
                                       <? if ($data['nagrtype'] == 3): ?>checked<? endif; ?>>ГВС
                            </label>
                            <label class="radio-inline">
                                <input type="radio" name="nagrtype" value="4"
                                       <? if ($data['nagrtype'] == 4): ?>checked<? endif; ?>>Технологические нужды
                            </label>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td align="center" valign="middle" style="text-align: center"><p>4* </p></td>
                    <td valign="middle">
                        <div class="cel-title">Давление пара</div>
                    </td>
                    <td align="center" valign="middle">бар изб.</td>
                    <td valign="middle">
                        <input type="text" name="p4" value="<?= $data['p4'] ?>" class="form-control" required>
                    </td>
                </tr>
                <tr>
                    <td align="center" valign="middle" style="text-align: center"><p>5* </p></td>
                    <td valign="middle">
                        <div class="cel-title">Температура пара (для перегретого пара)</div>
                    </td>
                    <td align="center" valign="middle">°С</td>
                    <td valign="middle">
                        <input type="text" name="p5" value="<?= $data['p5'] ?>" class="form-control" required>
                    </td>
                </tr>
                <tr>
                    <td align="center" valign="middle"></td>
                    <td colspan="3" align="center" valign="middle"><strong>Нагреваемая сторона –
                            <input type="text" name="storona" value="<?= $data['storona'] ?>" class="form-control"
                                   placeholder="укажите какая" required></strong>
                    </td>
                </tr>
                <tr>
                    <td align="center" valign="middle" style="text-align: center"><p>6* </p></td>
                    <td valign="middle">
                        <div class="cel-title">Температура на входе</div>
                    </td>
                    <td valign="middle"><p align="center">°С </p></td>
                    <td valign="middle">
                        <input type="text" name="p6" value="<?= $data['p6'] ?>" class="form-control" required>
                    </td>
                </tr>
                <tr>
                    <td align="center" valign="middle" style="text-align: center"><p>7* </p></td>
                    <td valign="middle">
                        <div class="cel-title">Температура на выходе</div>
                    </td>
                    <td align="center" valign="middle">°С</td>
                    <td valign="middle">
                        <input type="text" name="p7" value="<?= $data['p7'] ?>" class="form-control" required>
                    </td>
                </tr>
                <tr>
                    <td align="center" valign="middle" style="text-align: center"><p>8 </p></td>
                    <td valign="middle">
                        <div class="cel-title">Максимальные допустимые потери давления на теплообменнике</div>
                    </td>
                    <td align="center" valign="middle">м.в.ст.</td>
                    <td valign="middle">
                        <input type="text" name="p8" value="<?= $data['p8'] ?>" class="form-control">
                    </td>
                </tr>
                <tr>
                    <td align="center" valign="middle" style="text-align: center"><p align="center"> </p></td>
                    <td colspan="3" valign="middle"><p align="center"><strong><em>Требования к
                                    теплообменнику</em></strong></p></td>
                </tr>
                <tr>
                    <td align="center" valign="middle" style="text-align: center"><p>9 </p></td>
                    <td valign="middle">
                        <div class="cel-title">Максимальная рабочая температура</div>
                    </td>
                    <td align="center" valign="middle">°С</td>
                    <td valign="middle">
                        <input type="text" name="p9" value="<?= $data['p9'] ?>" class="form-control">
                    </td>
                </tr>
                <tr>
                    <td align="center" valign="middle" style="text-align: center"><p>10 </p></td>
                    <td valign="middle">
                        <div class="cel-title">Максимальное рабочее давление</div>
                    </td>
                    <td align="center" valign="middle">бар изб.</td>
                    <td valign="middle">
                        <input type="text" name="p10" value="<?= $data['p10'] ?>" class="form-control">
                    </td>
                </tr>
                <tr>
                    <td align="center" valign="middle" style="text-align: center"><p align="center"> </p></td>
                    <td colspan="3" valign="middle">
                        <div class="cel-title">Примечание:</div>
                    </td>
                </tr>
                <tr>
                    <td align="center" valign="middle" style="text-align: center"><p>11 </p></td>
                    <td colspan="3" valign="middle">
                        <textarea name="COMMENTS" id="input" class="form-control"></textarea>
                    </td>
                </tr>
            </table>
            <?
            $content = ob_get_contents();
            ob_end_flush();

            if ($_REQUEST['save'] == 'Y') {
                nimdaCreateLead($content);
            }
            ?>
            <hr>
            <div class="row">
                <? if (empty($_GET['result'])): ?>
                    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 text-center">
                        <label class="sts21_b2_p2"><input required type="checkbox" name="legal_top" class="js-legal"
                                                          value="Y"> Нажимая кнопку “Отправить”, вы принимаете согласие
                            на&nbsp;обработку <a
                                    href="/include/licenses_detail.php" target="_blank">персональных
                                данных</a></label><br>
                        <button type="submit" class="btn-lg btn-info">Отправить</button>
                    </div>
                <? endif; ?>
                <div class="col-md-12 text-center footer">
                    <? $APPLICATION->IncludeComponent("bitrix:main.include", "", array(
                            "AREA_FILE_SHOW" => "file",
                            "PATH" => SITE_DIR . "include/forms/footer.php",
                            "EDIT_TEMPLATE" => "standard.php"
                        )
                    ); ?>
                </div>
            </div>
        </div>
    </form>
<? } ?>
<? require($_SERVER["DOCUMENT_ROOT"] . "/bitrix/footer.php"); ?>