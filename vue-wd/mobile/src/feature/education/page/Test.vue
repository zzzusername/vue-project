<template>
  <div style="width: 100%;">
    <div class="table-head">
      <table>
        <!-- <colgroup>
          <col style="width: 80px;" />
          <col />
        </colgroup> -->
        <thead>
          <tr>
            <th>序号</th>
            <th>内容</th>
          </tr>
        </thead>
      </table>
    </div>
    <div style="height: 500px;overflow:hidden">
      <scroller>
        <div style="height:26px;"></div>
        <table>
          <colgroup><col style="width: 80px;" /><col /></colgroup>
          <tbody>
            <tr>
              <td>1</td>
              <td>我只是用来测试的</td>
            </tr>
            <tr>
              <td>2</td>
              <td>我只是用来测试的</td>
            </tr>
            <tr>
              <td>3</td>
              <td>我只是用来测试的</td>
            </tr>
            <tr>
              <td>4</td>
              <td>我只是用来测试的</td>
            </tr>
            <tr>
              <td>5</td>
              <td>我只是用来测试的</td>
            </tr>
            <tr>
              <td>6</td>
              <td>我只是用来测试的</td>
            </tr>
            <tr>
              <td>7</td>
              <td>我只是用来测试的</td>
            </tr>
            <tr>
              <td>8</td>
              <td>我只是用来测试的</td>
            </tr>
            <tr>
              <td>9</td>
              <td>我只是用来测试的</td>
            </tr>
            <tr>
              <td>10</td>
              <td>我只是用来测试的</td>
            </tr>
            <tr>
              <td>11</td>
              <td>我只是用来测试的</td>
            </tr>
            <tr>
              <td>12</td>
              <td>我只是用来测试的</td>
            </tr>
            <tr>
              <td>13</td>
              <td>我只是用来测试的</td>
            </tr>
            <tr>
              <td>14</td>
              <td>我只是用来测试的</td>
            </tr>
            <tr>
              <td>15</td>
              <td>我只是用来测试的</td>
            </tr>
          </tbody>
        </table>
      </scroller>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style>
.table-head {
  padding-right: 17px;
  background-color: #999;
  color: #000;
}

.table-body {
  width: 100%;
  height: 300px;
  overflow-y: scroll;
}

.table-head table,
.table-body table {
  width: 100%;
}

.table-body table tr:nth-child(2n+1) {
  background-color: #f2f2f2;
}
</style>
